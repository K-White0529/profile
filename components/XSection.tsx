"use client";

import { useEffect, useRef } from "react";
import SectionWrapper from "./SectionWrapper";
import config from "@/config/profile";

export default function XSection() {
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const account = config.accounts.find((a) => a.id === "x");
  const pinnedUrls = config.x.pinnedPostUrls;
  const hasPinnedPosts = pinnedUrls.length > 0;
  const basePath = process.env.NODE_ENV === "production" ? "/profile" : "";
  const headerImage = config.x.headerImagePath
    ? `${basePath}${config.x.headerImagePath}`
    : "";
  const avatarSrc = config.avatarPath
    ? `${basePath}${config.avatarPath}`
    : "";

  useEffect(() => {
    if (!hasPinnedPosts || !embedContainerRef.current) return;

    embedContainerRef.current.innerHTML = "";
    pinnedUrls.forEach((url) => {
      const blockquote = document.createElement("blockquote");
      blockquote.className = "twitter-tweet";
      blockquote.setAttribute("data-theme", "light");
      const anchor = document.createElement("a");
      anchor.href = url;
      blockquote.appendChild(anchor);
      embedContainerRef.current?.appendChild(blockquote);
    });

    if (
      !document.querySelector(
        'script[src*="platform.twitter.com/widgets.js"]'
      )
    ) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);
    } else {
      (
        window as unknown as {
          twttr?: { widgets?: { load: () => void } };
        }
      )?.twttr?.widgets?.load();
    }
  }, [hasPinnedPosts, pinnedUrls]);

  return (
    <SectionWrapper
      id="x"
      title="X (Twitter)"
      summary={hasPinnedPosts ? `${pinnedUrls.length} posts` : "プロフィール"}
    >
      {/* X風プロフィールカード */}
      <a
        href={account?.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block card !p-0 overflow-hidden hover:shadow-md transition-shadow"
      >
        {/* ヘッダーバナー */}
        <div className="relative h-[120px] bg-black">
          {headerImage && (
            <img
              src={headerImage}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* プロフィール情報 */}
        <div className="relative px-4 pb-4">
          {/* アバター（バナーに重なる位置） */}
          <div className="relative -mt-[34px] mb-3">
            <div className="w-[68px] h-[68px] rounded-full border-[3px] border-white bg-stone-200 overflow-hidden">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={config.displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="w-full h-full flex items-center justify-center text-stone-500 text-xl font-medium">${config.displayName.charAt(0)}</span>`;
                    }
                  }}
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-stone-500 text-xl font-medium">
                  {config.displayName.charAt(0)}
                </span>
              )}
            </div>
          </div>

          {/* 名前・ユーザー名 */}
          <div className="mb-2">
            <div className="font-bold text-stone-900 text-[15px] leading-tight">
              {config.displayName}
            </div>
            <div className="text-stone-500 text-[13px]">
              @{config.x.username}
            </div>
          </div>

          {/* 自己紹介 */}
          {(config.x.bio || account?.description) && (
            <p className="text-stone-700 text-[14px] leading-relaxed">
              {config.x.bio || account?.description}
            </p>
          )}
        </div>
      </a>

      {/* 固定ポスト */}
      {hasPinnedPosts && (
        <div ref={embedContainerRef} className="mt-6 space-y-4">
          <div className="skeleton h-[300px] w-full" />
        </div>
      )}
    </SectionWrapper>
  );
}
