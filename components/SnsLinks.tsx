import config from "@/config/profile";

export default function SnsLinks() {
  return (
    <section id="links" className="mt-12">
      <h2 className="section-title">Accounts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {config.accounts.map((account) => (
          <a
            key={account.id}
            href={account.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-card"
          >
            <div
              className="link-card-icon"
              style={{ backgroundColor: account.iconColor }}
            >
              {account.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-stone-800 text-sm">
                {account.name}
              </div>
              <div className="text-stone-400 text-xs truncate">
                {account.username}
              </div>
              <div className="text-stone-500 text-xs mt-0.5">
                {account.description}
              </div>
            </div>
            <svg
              className="w-4 h-4 text-stone-300 flex-shrink-0"
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
        ))}
      </div>
    </section>
  );
}
