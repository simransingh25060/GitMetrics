import axios from "axios";

const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
};

export async function getGithubUser(username: string) {
    const response = await axios.get(
        `https://api.github.com/users/${username}`,
        { headers }
    );

    return response.data;
}

export async function getGithubRepos(username: string) {
    const response = await axios.get(
        `https://api.github.com/users/${username}/repos?per_page=100`,
        { headers }
    );

    return response.data;
}

export async function getRepoLanguages(
    owner: string,
    repo: string
) {
    const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/languages`,
        { headers }
    );

    return response.data;
}