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
  displayName: "K_White",
  bio: "",
  avatarPath: "/favicon.ico",

  accounts: [
    {
      id: "x",
      name: "Twitter (新 X)",
      url: "https://x.com/_K_White_",
      username: "@K_White",
      description: "オタクアカウント",
      iconColor: "#000000",
    },
    {
      id: "youtube",
      name: "YouTube",
      url: "https://youtube.com/@K_White",
      username: "@K_White",
      description: "コメント・記録配信用",
      iconColor: "#FF0000",
    },
    {
      id: "bluesky",
      name: "Bluesky",
      url: "https://bsky.app/profile/k-white.bsky.social",
      username: "@K_White",
      description: "掃きだめ",
      iconColor: "#0085FF",
    },
    {
      id: "instagram",
      name: "Instagram",
      url: "https://www.instagram.com/_k_white_",
      username: "@K_White",
      description: "飯テロ・音楽・写真",
      iconColor: "#E4405F",
    },
    {
      id: "mixi2",
      name: "mixi2",
      url: "https://mixi.social/@K_White",
      username: "@K_White",
      description: "見る用",
      iconColor: "#F7931E",
    },
    {
      id: "github",
      name: "GitHub",
      url: "https://github.com/K-White0529",
      username: "K_White",
      description: "物は試し・保管庫",
      iconColor: "#181717",
    },
    {
      id: "qiita",
      name: "Qiita",
      url: "https://qiita.com/K_White",
      username: "K_White",
      description: "晒し上げ・ポエム・備忘録",
      iconColor: "#55C500",
    },
  ],

  youtube: {
    channelId: "UCNwXcC76OARf-URWIpmtBYw", // YouTube Data APIで使用するチャンネルID
    apiKey: "", // 環境変数に記載
  },

  github: {
    username: "K-White0529",
  },

  qiita: {
    username: "K_White",
  },

  bluesky: {
    handle: "k-white.bsky.social",
  },

  x: {
    username: "_K_White_",
  },

  instagram: {
    embeddedPostUrls: [
      // 埋め込みたいInstagram投稿のURLをここに追加
      "https://www.instagram.com/_k_white_/p/DIbUjkLTEciGHo5DCWnn5YhACrhYEtwFpjbxDk0/",
      "https://www.instagram.com/_k_white_/p/C4p3ArWy-eyUvpV-zO36QKBtVus21AOlmjlBOg0/"
    ],
  },
};

export default config;
