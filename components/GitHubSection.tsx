"use client";

import { useEffect, useState } from "react";
import SectionWrapper from "./SectionWrapper";
import config from "@/config/profile";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

interface GitHubData {
  repos: GitHubRepo[];
  fetchedAt: string;
  error?: string;
}

export default function GitHubSection() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const username = config.github.username;
  const basePath = process.env.NODE_ENV === "production" ? "/profile" : "";

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${basePath}/data/github.json`);
        if (!res.ok) throw new Error("データの読み込みに失敗しました");
        const data: GitHubData = await res.json();

        if (data.error || data.repos.length === 0) {
          setError(
            data.error || "GitHub リポジトリが見つかりませんでした"
          );
        } else {
          setRepos(data.repos);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "データの読み込みに失敗しました"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [basePath]);

  /** 言語ごとの色定義 */
  const langColors: Record<string, string> = {
    TypeScript: "#3178C6",
    JavaScript: "#F7DF1E",
    Python: "#3572A5",
    Rust: "#DEA584",
    Go: "#00ADD8",
    Java: "#B07219",
    "C#": "#178600",
    Ruby: "#701516",
    HTML: "#E34C26",
    CSS: "#563D7C",
    Shell: "#89E051",
  };

  return (
    <SectionWrapper
      id="github"
      title="GitHub"
      summary={repos.length > 0 ? `${repos.length} repos` : undefined}
    >
      {/* コントリビューションカレンダー */}
      <div className="card mb-4 overflow-x-auto">
        <img
          src={`https://ghchart.rshah.org/44403c/${username}`}
          alt={`${username} の GitHub Contributions`}
          className="w-full h-auto max-w-full"
          loading="lazy"
        />
      </div>

      {/* リポジトリ一覧 */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton h-4 w-1/2 mb-2" />
              <div className="skeleton h-3 w-full mb-1" />
              <div className="skeleton h-3 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="card">
          <p className="text-stone-400 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && repos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="card block group"
            >
              <h3 className="text-sm font-medium text-stone-700 group-hover:text-stone-900 truncate">
                {repo.name}
              </h3>
              {repo.description && (
                <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                  {repo.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2 text-xs text-stone-400">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{
                        backgroundColor:
                          langColors[repo.language] || "#8B8B8B",
                      }}
                    />
                    {repo.language}
                  </span>
                )}
                {repo.stargazers_count > 0 && (
                  <span>★ {repo.stargazers_count}</span>
                )}
                {repo.forks_count > 0 && (
                  <span>🔀 {repo.forks_count}</span>
                )}
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="mt-4 text-center">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-stone-500 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-500"
        >
          すべてのリポジトリを見る →
        </a>
      </div>
    </SectionWrapper>
  );
}
