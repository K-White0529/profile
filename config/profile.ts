/**
 * プロフィール設定ファイル
 * 各サービスのアカウント情報やプロフィール情報を一元管理する。
 * アカウント情報の変更はこのファイルのみ編集すればよい。
 */

export interface SocialAccount {
  id: string;
  name: string;
  url: string;
  username: string;
  description: string;
  iconColor: string;
}

export interface ProfileConfig {
  displayName: string;
  bio: string;
  avatarPath: string;
  accounts: SocialAccount[];
  youtube: {
    channelId: string;
    apiKey: string;
  };
  github: {
    username: string;
  };
  qiita: {
    username: string;
  };
  bluesky: {
    handle: string;
  };
  x: {
    username: string;
  };
  instagram: {
    /** 手動で埋め込みたい投稿のURL一覧 */
    embeddedPostUrls: string[];
  };
}

const config: ProfileConfig = {
  displayName: "HogeFuga",
  bio: "",
  avatarPath: "/avatar.png",

  accounts: [
    {
      id: "x",
      name: "X (Twitter)",
      url: "https://x.com/hogefuga",
      username: "@hogefuga",
      description: "日常のつぶやき・技術メモ",
      iconColor: "#000000",
    },
    {
      id: "youtube",
      name: "YouTube",
      url: "https://youtube.com/@hogefuga",
      username: "@hogefuga",
      description: "技術解説・Vlog",
      iconColor: "#FF0000",
    },
    {
      id: "bluesky",
      name: "Bluesky",
      url: "https://bsky.app/profile/hogefuga.bsky.social",
      username: "@hogefuga.bsky.social",
      description: "分散SNSでの発信",
      iconColor: "#0085FF",
    },
    {
      id: "instagram",
      name: "Instagram",
      url: "https://www.instagram.com/hogefuga",
      username: "@hogefuga",
      description: "写真・日常の記録",
      iconColor: "#E4405F",
    },
    {
      id: "mixi2",
      name: "mixi2",
      url: "https://mixi.social/@hogefuga",
      username: "@hogefuga",
      description: "身近な人との交流",
      iconColor: "#F7931E",
    },
    {
      id: "github",
      name: "GitHub",
      url: "https://github.com/hogefuga",
      username: "hogefuga",
      description: "OSS活動・個人プロジェクト",
      iconColor: "#181717",
    },
    {
      id: "qiita",
      name: "Qiita",
      url: "https://qiita.com/hogefuga",
      username: "hogefuga",
      description: "技術記事の投稿",
      iconColor: "#55C500",
    },
  ],

  youtube: {
    channelId: "UC_xxxxxxxxxxxxx", // YouTube Data APIで使用するチャンネルID
    apiKey: "", // YouTube Data API v3 のAPIキー（環境変数 NEXT_PUBLIC_YOUTUBE_API_KEY を推奨）
  },

  github: {
    username: "hogefuga",
  },

  qiita: {
    username: "hogefuga",
  },

  bluesky: {
    handle: "hogefuga.bsky.social",
  },

  x: {
    username: "hogefuga",
  },

  instagram: {
    embeddedPostUrls: [
      // 埋め込みたいInstagram投稿のURLをここに追加
      // 例: "https://www.instagram.com/p/XXXXXXXXXXX/"
    ],
  },
};

export default config;
