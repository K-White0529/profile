import SectionWrapper from "./SectionWrapper";
import config from "@/config/profile";

export default function InstagramSection() {
  const account = config.accounts.find((a) => a.id === "instagram");
  const isPrivate = config.instagram.isPrivate;
  const basePath = process.env.NODE_ENV === "production" ? "/profile" : "";
  const avatarSrc = config.avatarPath
    ? `${basePath}${config.avatarPath}`
    : "";

  return (
    <SectionWrapper id="instagram" title="Instagram" summary="プロフィール">
      {/* Instagram風プロフィールカード */}
      <a
        href={account?.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block card !p-6 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div className="flex items-start gap-5">
          {/* プロフィール画像（Instagramグラデーションボーダー） */}
          <div className="flex-shrink-0">
            <div
              className="w-[80px] h-[80px] rounded-full p-[3px]"
              style={{
                background:
                  "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
              }}
            >
              <div className="w-full h-full rounded-full bg-white p-[2px]">
                <div className="w-full h-full rounded-full bg-stone-100 overflow-hidden flex items-center justify-center">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={config.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-stone-500 text-2xl font-medium">
                      {config.displayName.charAt(0)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* プロフィール情報 */}
          <div className="flex-1 min-w-0 pt-1">
            {/* ユーザー名 + 鍵アイコン */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="font-bold text-stone-900 text-[15px]">
                {account?.username}
              </span>
              {isPrivate && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-stone-500"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
            </div>

            {/* 自己紹介 */}
            {account?.description && (
              <p className="text-stone-700 text-[14px] leading-relaxed mb-3">
                {account.description}
              </p>
            )}

            {/* 非公開注記 */}
            {isPrivate && (
              <div className="flex items-center gap-1.5 text-stone-400 text-xs">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>
                  このアカウントは非公開です。投稿を閲覧するにはフォローリクエストが必要です。
                </span>
              </div>
            )}
          </div>
        </div>
      </a>
    </SectionWrapper>
  );
}
