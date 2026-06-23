"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);


  const handleAnalyze = async () => {
    if (!username.trim()) return;

    try {

      const profileRes = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const profileData = await profileRes.json();

      setUserData(profileData);

      setLoadingReport(true);

      const reportRes = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const reportData = await reportRes.json();

      setAnalysis(reportData.analysis);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <main className="min-h-screen text-white">
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            GitMetrics
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Understand Your GitHub Profile Beyond the Numbers
          </h2>

          <p className="max-w-3xl mx-auto text-zinc-400 text-lg leading-relaxed mb-12">
            Analyze any GitHub profile and receive AI-powered insights about
            technical strengths, coding patterns, project quality, skill gaps
            and a personalized learning roadmap.
          </p>

          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 px-5 py-4 rounded-xl bg-zinc-900 border border-zinc-700 outline-none focus:border-blue-500"
            />

            <button
              onClick={handleAnalyze}
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-300 font-medium"
            >
              Analyze Profile
            </button>
          </div>
          {userData && (
            <div className="mt-10 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <img
                src={userData.avatar_url}
                alt={userData.login}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />

              <h2 className="text-2xl font-bold">
                {userData.name}
              </h2>

              <p className="text-zinc-400">@{userData.login}</p>

              <p className="mt-4">{userData.bio}</p>

              <div className="flex justify-center gap-8 mt-6">
                <div>
                  <p className="font-bold">{userData.followers}</p>
                  <p>Followers</p>
                </div>

                <div>
                  <p className="font-bold">{userData.following}</p>
                  <p>Following</p>
                </div>

                <div>
                  <p className="font-bold">{userData.public_repos}</p>
                  <p>Repos</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-6">
            AI Analysis Report
          </h3>

          {loadingReport ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <p>Generating AI Insights...</p>
            </div>
          ) : analysis ? (
            <>

              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 rounded-2xl mb-6">
                <h2 className="text-lg">GitHub Score</h2>
                <p className="text-5xl font-bold">
                  {analysis.score}/100
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-zinc-900 border border-green-500/20 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-3">
                    💪 Strengths
                  </h3>

                  <ul className="space-y-2">
                    {analysis.strengths?.map(
                      (strength: string, index: number) => (
                        <li key={index}>✓ {strength}</li>
                      )
                    )}
                  </ul>
                </div>

                <div className="bg-zinc-900 border border-red-500/20 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-3">
                    ⚠️ Weaknesses
                  </h3>

                  <ul className="space-y-2">
                    {analysis.weaknesses?.map(
                      (weakness: string, index: number) => (
                        <li key={index}>• {weakness}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              {/* Markdown Report */}
              <div className="prose prose-invert max-w-none">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-3">
                    📋 Overview
                  </h3>

                  <p className="text-zinc-300">
                    {analysis.overview}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-zinc-500">
              Enter a GitHub username and click Analyze Profile to
              generate an AI-powered report.
            </p>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h3 className="text-3xl font-bold text-center mb-12">
          What You'll Get
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="text-4xl mb-4">📊</div>
            <h4 className="text-xl font-semibold mb-3">
              Repository Analysis
            </h4>
            <p className="text-zinc-400">
              Analyze repositories, stars, languages, commits and contribution
              patterns.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="text-4xl mb-4">🤖</div>
            <h4 className="text-xl font-semibold mb-3">
              AI Skill Assessment
            </h4>
            <p className="text-zinc-400">
              Discover your strongest technologies and identify areas for
              improvement.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="text-4xl mb-4">🚀</div>
            <h4 className="text-xl font-semibold mb-3">
              Career Suggestions
            </h4>
            <p className="text-zinc-400">
              Get role recommendations based on your projects and coding
              experience.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="text-4xl mb-4">📈</div>
            <h4 className="text-xl font-semibold mb-3">
              Learning Roadmap
            </h4>
            <p className="text-zinc-400">
              Receive a personalized roadmap to become a better developer.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-center mb-8">
            Powered By
          </h3>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl mb-2">✓</p>
              <p>GitHub Data Analysis</p>
            </div>

            <div>
              <p className="text-3xl mb-2">✓</p>
              <p>Google Gemini AI</p>
            </div>

            <div>
              <p className="text-3xl mb-2">✓</p>
              <p>Markdown Reports</p>
            </div>

            <div>
              <p className="text-3xl mb-2">✓</p>
              <p>Personalized Insights</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}