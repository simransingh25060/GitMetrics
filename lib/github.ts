import axios from "axios";

export async function getGithubUser(username: string) {
    try {
        const response = await axios.get(
            `https://api.github.com/users/${username}`
        );

        return response.data;
    } catch (error) {
        throw new Error("GitHub user not found");
    }
}