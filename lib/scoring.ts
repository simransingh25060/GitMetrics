export interface ProfileSummary {
    followers: number;
    publicRepos: number;
    totalStars: number;
    bio: string | null;
    topLanguages: string[];
}

export function calculateScore(summary: ProfileSummary): number {
    const followers = summary.followers || 0;
    const publicRepos = summary.publicRepos || 0;
    const totalStars = summary.totalStars || 0;
    const hasBio = !!(summary.bio && summary.bio.trim().length > 0);
    const topLanguages = summary.topLanguages || [];

    const baseScore = 30;

    const repoScore = Math.min(30, Math.round(Math.log10(publicRepos + 1) * 15));

    const starScore = Math.min(40, Math.round(Math.log10(totalStars + 1) * 20));

    const followerScore = Math.min(20, Math.round(Math.log10(followers + 1) * 10));

    let completenessScore = 0;
    if (hasBio) completenessScore += 4;
    if (topLanguages.length >= 1) completenessScore += 3;
    if (topLanguages.length >= 3) completenessScore += 3;

    const calculated = baseScore + repoScore + starScore + followerScore + completenessScore;

    return Math.min(100, Math.max(30, calculated));
}
