# Profile

SNSアカウント・メディアアカウントの活動を一覧できる個人プロフィールページ。

## 技術スタック

- **Next.js 16** (App Router, Static Export)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **GitHub Pages** (デプロイ先)

## 対応サービス

| サービス | 連携方式 |
|---|---|
| X (Twitter) | タイムライン埋め込みウィジェット |
| YouTube | YouTube Data API v3 |
| Bluesky | bsky-embed Webコンポーネント |
| Instagram | 個別投稿のoEmbed埋め込み |
| GitHub | GitHub REST API |
| Qiita | Qiita API v2 |
| mixi2 | プロフィールリンク |

## セットアップ

```bash
cd profile
npm install
npm run dev
```

## 設定

`config/profile.ts` を編集してアカウント情報を変更してください。

### YouTube API キーの設定

YouTube の最新動画を表示するには、YouTube Data API v3 のAPIキーが必要です。

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成
2. YouTube Data API v3 を有効化
3. APIキーを作成（HTTPリファラ制限推奨）
4. `config/profile.ts` の `youtube.apiKey` に設定、または環境変数 `NEXT_PUBLIC_YOUTUBE_API_KEY` に設定

### Instagram 投稿の埋め込み

`config/profile.ts` の `instagram.embeddedPostUrls` に表示したい投稿のURLを追加してください。

## ビルド

```bash
npm run build
```

`out/` ディレクトリに静的ファイルが生成されます。

## デプロイ

GitHub にリポジトリを作成し、`main` ブランチにプッシュすると GitHub Actions が自動でビルド・デプロイを行います。

### GitHub Pages の設定

1. リポジトリの Settings → Pages に移動
2. Source を「GitHub Actions」に設定
