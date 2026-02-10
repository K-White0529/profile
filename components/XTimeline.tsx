"use client";

import { useEffect, useRef } from "react";
import SectionWrapper from "./SectionWrapper";
import config from "@/config/profile";

export default function XTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // X タイムライン埋め込みの blockquote を挿入
    const anchor = document.createElement("a");
    anchor.className = "twitter-timeline";
    anchor.setAttribute("data-height", "500");
    anchor.setAttribute("data-theme", "light");
    anchor.setAttribute("data-chrome", "noheader nofooter noborders");
    anchor.href = `https://twitter.com/${config.x.username}`;
    anchor.textContent = `Tweets by ${config.x.username}`;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(anchor);

    // widgets.js を読み込む
    if (!document.querySelector('script[src*="platform.twitter.com/widgets.js"]')) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);
    } else {
      // 既にスクリプトが読み込まれている場合は再レンダリング
      (window as unknown as { twttr?: { widgets?: { load: () => void } } })
        ?.twttr?.widgets?.load();
    }
  }, []);

  return (
    <SectionWrapper id="x" title="X (Twitter)" summary="タイムライン">
      <div className="card">
        <div ref={containerRef}>
          <div className="skeleton h-[500px] w-full" />
        </div>
      </div>
    </SectionWrapper>
  );
}
