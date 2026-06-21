import { NextResponse } from "next/server";
import { getGithubUser } from "@/lib/github";

export async function POST(req: Request) {
    try {
        const { username } = await req.json();

        const user = await getGithubUser(username);

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch GitHub user" },
            { status: 500 }
        );
    }
}