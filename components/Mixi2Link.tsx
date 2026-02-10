import SectionWrapper from "./SectionWrapper";
import config from "@/config/profile";

export default function Mixi2Link() {
  const account = config.accounts.find((a) => a.id === "mixi2");
  if (!account) return null;

  return (
    <SectionWrapper id="mixi2" title="mixi2" summary="リンクのみ">
      <div className="card">
        <p className="text-stone-500 text-sm mb-3">
          mixi2 は現在、外部への埋め込み機能やAPIが公開されていないため、プロフィールリンクのみ掲載しています。
        </p>
        <a
          href={account.url}
          target="_blank"
          rel="noopener noreferrer"
          className="link-card inline-flex"
        >
          <div
            className="link-card-icon"
            style={{ backgroundColor: account.iconColor }}
          >
            m
          </div>
          <div>
            <div className="font-medium text-stone-800 text-sm">
              {account.name}
            </div>
            <div className="text-stone-400 text-xs">{account.username}</div>
          </div>
          <svg
            className="w-4 h-4 text-stone-300 flex-shrink-0 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>
    </SectionWrapper>
  );
}
