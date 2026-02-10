"use client";

import { useEffect, useRef } from "react";
import SectionWrapper from "./SectionWrapper";
import config from "@/config/profile";

export default function InstagramPosts() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const urls = config.instagram.embeddedPostUrls;

    if (urls.length === 0) return;

    // 各投稿の blockquote を生成
    containerRef.current.innerHTML = "";
    urls.forEach((url) => {
      const blockquote = document.createElement("blockquote");
      blockquote.className = "instagram-media";
      blockquote.setAttribute("data-instgrm-captioned", "");
      blockquote.setAttribute("data-instgrm-permalink", url);
      blockquote.setAttribute("data-instgrm-version", "14");
      containerRef.current?.appendChild(blockquote);
    });

    // Instagram の embed.js を読み込む
    if (
      !document.querySelector('script[src*="instagram.com/embed.js"]')
    ) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      (window as unknown as { instgrm?: { Embeds?: { process: () => void } } })
        ?.instgrm?.Embeds?.process();
    }
  }, []);

  const hasEmbeds = config.instagram.embeddedPostUrls.length > 0;

  return (
    <SectionWrapper
      id="instagram"
      title="Instagram"
      summary={hasEmbeds ? `${config.instagram.embeddedPostUrls.length} posts` : undefined}
    >
      <div className="card">
        {hasEmbeds ? (
          <div
            ref={containerRef}
            className="flex flex-wrap gap-4 justify-center"
          >
            <div className="skeleton h-[400px] w-full max-w-[400px]" />
          </div>
        ) : (
          <div>
            <p className="text-stone-400 text-sm">
              投稿の埋め込みは設定ファイルから追加できます。
            </p>
            <a
              href={
                config.accounts.find((a) => a.id === "instagram")?.url
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-stone-600 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-500"
            >
              Instagram プロフィールを開く →
            </a>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
