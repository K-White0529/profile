"use client";

import { useEffect, useState } from "react";
import SectionWrapper from "./SectionWrapper";
import config from "@/config/profile";

interface QiitaArticle {
  id: string;
  title: string;
  url: string;
  likes_count: number;
  tags: { name: string }[];
  created_at: string;
}

interface QiitaData {
  articles: QiitaArticle[];
  fetchedAt: string;
  error?: string;
}

export default function QiitaArticles() {
  const [articles, setArticles] = useState<QiitaArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const username = config.qiita.username;
  const basePath = process.env.NODE_ENV === "production" ? "/profile" : "";

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${basePath}/data/qiita.json`);
        if (!res.ok) throw new Error("データの読み込みに失敗しました");
        const data: QiitaData = await res.json();

        if (data.error || data.articles.length === 0) {
          setError(
            data.error || "Qiita の記事が見つかりませんでした"
          );
        } else {
          setArticles(data.articles);
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

  return (
    <SectionWrapper
      id="qiita"
      title="Qiita"
      summary={articles.length > 0 ? `最新 ${articles.length} 記事` : undefined}
    >
      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton h-4 w-3/4 mb-2" />
              <div className="skeleton h-3 w-1/3" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="card">
          <p className="text-stone-400 text-sm">{error}</p>
          <a
            href={`https://qiita.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm text-stone-600 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-500"
          >
            Qiita プロフィールを開く →
          </a>
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <div className="space-y-3">
          {articles.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card block group"
            >
              <h3 className="text-sm font-medium text-stone-700 group-hover:text-stone-900 line-clamp-1 leading-snug">
                {article.title}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-xs text-stone-400">
                <time>
                  {new Date(article.created_at).toLocaleDateString("ja-JP")}
                </time>
                {article.likes_count > 0 && (
                  <span>♥ {article.likes_count}</span>
                )}
                {article.tags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.name}
                        className="px-1.5 py-0.5 bg-stone-100 rounded text-stone-500"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="mt-4 text-center">
        <a
          href={`https://qiita.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-stone-500 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-500"
        >
          すべての記事を見る →
        </a>
      </div>
    </SectionWrapper>
  );
}
