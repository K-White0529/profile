"use client";

import { useEffect, useRef } from "react";
import SectionWrapper from "./SectionWrapper";
import config from "@/config/profile";

export default function BlueskyFeed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // bsky-embed Web Component を使用
    // https://github.com/nicolo-ribaudo/bsky-embed
    const bskyEmbed = document.createElement("bsky-embed");
    bskyEmbed.setAttribute("username", config.bluesky.handle);
    bskyEmbed.setAttribute("limit", "5");
    bskyEmbed.setAttribute("mode", "light");

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(bskyEmbed);

    // bsky-embed のスクリプトを読み込む
    if (
      !document.querySelector(
        'script[src*="bsky-embed"]'
      )
    ) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/bsky-embed/dist/bsky-embed.es.js";
      script.type = "module";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <SectionWrapper id="bluesky" title="Bluesky" summary="最新投稿">
      <div className="card">
        <div ref={containerRef}>
          <div className="skeleton h-[400px] w-full" />
        </div>
      </div>
    </SectionWrapper>
  );
}
