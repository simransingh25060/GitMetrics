"use client";

import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");

  const handleAnalyze = () => {
    if (!username.trim()) return;

    console.log(username);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
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

          {/* Search Box */}
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
        </div>
      </section>

      {/* Features */}
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

      {/* Trust Section */}
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

      {/* Results Section */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 min-h-[50px]">
          <h3 className="text-2xl font-bold mb-4">Analysis Results</h3>

          <p className="text-zinc-500">
            Enter a GitHub username and click Analyze Profile to generate an
            AI-powered report.
          </p>
        </div>
      </section>
    </main>
  );
}