"use client";

import { useEffect, useState } from "react";
import SectionWrapper from "./SectionWrapper";
import config from "@/config/profile";

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

interface YouTubeData {
  videos: YouTubeVideo[];
  fetchedAt: string;
  error?: string;
}

export default function YouTubeSection() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const basePath = process.env.NODE_ENV === "production" ? "/profile" : "";

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${basePath}/data/youtube.json`);
        if (!res.ok) throw new Error("データの読み込みに失敗しました");
        const data: YouTubeData = await res.json();

        if (data.error || data.videos.length === 0) {
          setError(
            data.error || "YouTube の動画が見つかりませんでした"
          );
        } else {
          setVideos(data.videos);
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
      id="youtube"
      title="YouTube"
      summary={videos.length > 0 ? `最新 ${videos.length} 本` : undefined}
    >
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton h-36 w-full mb-3" />
              <div className="skeleton h-4 w-3/4" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="card">
          <p className="text-stone-400 text-sm">{error}</p>
          <a
            href={config.accounts.find((a) => a.id === "youtube")?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm text-stone-600 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-500"
          >
            YouTube チャンネルを開く →
          </a>
        </div>
      )}

      {!loading && !error && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {videos.map((video) => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card block group"
            >
              <div className="overflow-hidden rounded mb-3">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <h3 className="text-sm font-medium text-stone-700 line-clamp-2 leading-snug">
                {video.title}
              </h3>
              <time className="text-xs text-stone-400 mt-1 block">
                {new Date(video.publishedAt).toLocaleDateString("ja-JP")}
              </time>
            </a>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
