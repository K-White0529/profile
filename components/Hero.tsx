"use client";

import config from "@/config/profile";

export default function Hero() {
  const basePath = process.env.NODE_ENV === "production" ? "/profile" : "";

  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-stone-100 to-stone-50 pt-16 pb-12">
      {/* 装飾ライン */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-stone-300 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* アバター */}
        <div className="mb-6">
          <div className="w-28 h-28 mx-auto rounded-full bg-stone-200 border-2 border-stone-300 overflow-hidden flex items-center justify-center">
            <img
              src={`${basePath}${config.avatarPath}`}
              alt={config.displayName}
              width={112}
              height={112}
              className="w-full h-full object-cover"
              onError={(e) => {
                // アバター画像が無い場合はイニシャルを表示
                const target = e.currentTarget;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span style="font-family: var(--font-display); font-size: 2.5rem; color: var(--color-stone-500);">${config.displayName.charAt(0)}</span>`;
                }
              }}
            />
          </div>
        </div>

        {/* 名前 */}
        <h1
          className="text-4xl sm:text-5xl font-medium tracking-wide text-stone-800"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {config.displayName}
        </h1>

        {/* 紹介文 */}
        {config.bio && (
          <p className="mt-4 text-stone-500 text-base max-w-lg mx-auto">
            {config.bio}
          </p>
        )}

        {/* サービス数バッジ */}
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          <span className="summary-badge">
            {config.accounts.length} platforms
          </span>
        </div>
      </div>
    </header>
  );
}
