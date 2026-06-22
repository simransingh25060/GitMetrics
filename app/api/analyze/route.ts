import { NextResponse } from "next/server";

import {
    getGithubUser,
    getGithubRepos,
    getRepoLanguages,
} from "@/lib/github";

import { model } from "@/lib/gemini";

export async function POST(req: Request) {
    try {
        const { username } = await req.json();

        const user = await getGithubUser(username);

        const repos = await getGithubRepos(username);

        //pick top 5 starred repos
        const selectedRepos = repos
            .sort(
                (a, b) =>
                    b.stargazers_count -
                    a.stargazers_count
            )
            .slice(0, 5);

        let totalStars = 0;

        const languages: Record<string, number> = {};

        //fetch repo languages
        const languageResults =
            await Promise.allSettled(
                selectedRepos.map((repo) =>
                    getRepoLanguages(
                        username,
                        repo.name
                    )
                )
            );

        selectedRepos.forEach((repo, index) => {
            totalStars += repo.stargazers_count;

            const result =
                languageResults[index];

            if (
                result.status === "fulfilled"
            ) {
                const repoLanguages =
                    result.value as Record<
                        string,
                        number
                    >;

                for (const lang in repoLanguages) {
                    languages[lang] =
                        (languages[lang] || 0) +
                        repoLanguages[lang];
                }
            }
        });

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

        const prompt = `
Analyze this GitHub profile:

${JSON.stringify(summary, null, 2)}

Return ONLY valid JSON.

{
  "score": 0,
  "overview": "",
  "strengths": [],
  "weaknesses": [],
  "topSkills": [],
  "recommendedRoles": [],
  "nextSteps": []
}

Rules:
- score must be between 0 and 100
- strengths: 3-5 items
- weaknesses: 3-5 items
- topSkills: 3-5 items
- recommendedRoles: 2-4 items
- nextSteps: 3-5 items
- return ONLY JSON
`;

        let result: any = null;

        //retry gem
        for (let i = 0; i < 3; i++) {
            try {
                result =
                    await model.generateContent(
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

                await new Promise(
                    (resolve) =>
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

        const text =
            result.response.text();

        const cleanedText = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let analysis;

        try {
            analysis =
                JSON.parse(cleanedText);
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