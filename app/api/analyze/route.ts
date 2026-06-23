import { NextResponse } from "next/server";

import {
    getGithubUser,
    getGithubRepos,
    getRepoLanguages,
} from "@/lib/github";

import { model } from "@/lib/gemini";
import { calculateScore } from "@/lib/scoring";

export async function POST(req: Request) {
    try {
        const { username } = await req.json();

        const user = await getGithubUser(username);
        const repos = await getGithubRepos(username);

        // pick top 5 starred repos
        const selectedRepos = repos
            .sort(
                (a: any, b: any) =>
                    b.stargazers_count -
                    a.stargazers_count
            )
            .slice(0, 5);

        const languages: Record<string, number> = {};
        let totalStars = 0;

        // fetch repo languages sequentially to avoid rate-limit spikes
        for (const repo of selectedRepos) {
            totalStars += repo.stargazers_count;

            try {
                const repoLanguages =
                    await getRepoLanguages(
                        username,
                        repo.name
                    );

                for (const lang in repoLanguages) {
                    languages[lang] =
                        (languages[lang] || 0) +
                        repoLanguages[lang];
                }
            } catch (error) {
                console.error(
                    `Failed to fetch languages for ${repo.name}`,
                    error
                );
            }
        }

        const topLanguages = Object.entries(
            languages
        )
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([lang]) => lang);

        const summary = {
            name: user.name,
            username: user.login,
            followers: user.followers,
            following: user.following,
            publicRepos: user.public_repos,
            bio: user.bio,
            totalStars,
            topLanguages,
        };

        const calculatedScore = calculateScore(summary);

        const prompt = `
Analyze this GitHub profile:

${JSON.stringify(summary, null, 2)}

Return ONLY valid JSON.

{
  "score": ${calculatedScore},
  "overview": "",
  "strengths": [],
  "weaknesses": [],
  "topSkills": [],
  "recommendedRoles": [],
  "nextSteps": []
}

Rules:
- The profile score is pre-calculated to be exactly ${calculatedScore}. You MUST return this exact score value in the "score" field.
- strengths: 3-5 items
- weaknesses: 3-5 items
- topSkills: 3-5 items
- recommendedRoles: 2-4 items
- nextSteps: 3-5 items
- return ONLY JSON
`;

        let result: any = null;

        // retry gemini
        for (let i = 0; i < 3; i++) {
            try {
                result = await model.generateContent(
                    prompt
                );
                break;
            } catch (error: any) {
                console.error(
                    `Retry ${i + 1} failed:`,
                    error
                );

                if (i === 2) {
                    throw error;
                }

                await new Promise((resolve) =>
                    setTimeout(
                        resolve,
                        2000 * (i + 1)
                    )
                );
            }
        }

        if (!result) {
            throw new Error(
                "Failed to get response from Gemini"
            );
        }

        const text = result.response.text();

        const cleanedText = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let analysis;

        try {
            analysis = JSON.parse(cleanedText);
            // Enforce deterministic scoring
            analysis.score = calculatedScore;
        } catch {
            console.error(
                "Gemini Response:",
                text
            );

            throw new Error(
                "Gemini returned invalid JSON"
            );
        }

        return NextResponse.json({
            user,
            analysis,
        });
    } catch (error: any) {
        console.error("FULL GEMINI ERROR:");
        console.error(error);
        console.error(JSON.stringify(error, null, 2));

        if (error?.status === 429) {
            return NextResponse.json(
                {
                    error: "Gemini quota exceeded",
                },
                { status: 429 }
            );
        }

        return NextResponse.json(
            {
                error: error?.message || "Unknown error",
            },
            { status: 500 }
        );
    }
}