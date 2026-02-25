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
| X (Twitter) | X風プロフィールカード（手動設定）+ 固定ポストのoEmbed埋め込み |
| YouTube | YouTube Data API v3 |
| Bluesky | bsky-embed Webコンポーネント |
| Instagram | Instagram風プロフィールカード + 投稿のoEmbed埋め込み（URL指定時） |
| GitHub | GitHub REST API + ghchart.rshah.org（コントリビューションカレンダー） |
| Qiita | Qiita API v2 |
| mixi2 | プロフィールリンク |

## セットアップ

```bash
cd profile
npm install
npm run dev
```

## 設定

`config/profile.ts` を編集してアカウント情報を変更してください。各サービス固有の設定項目は以下のとおりです。

### YouTube API キーの設定

YouTube の最新動画を表示するには、YouTube Data API v3 のAPIキーが必要です。

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成
2. YouTube Data API v3 を有効化
3. APIキーを作成し、以下の利用制限を設定
   - **HTTPリファラ制限**：`https://<username>.github.io/profile/*` のみ許可
   - **API制限**：YouTube Data API v3 のみ利用可能に限定
4. APIキーの設定場所
   - ローカル開発時：`.env.local` に `NEXT_PUBLIC_YOUTUBE_API_KEY=YOUR_KEY` を記載
   - GitHub Actions：リポジトリの Settings → Secrets and variables → Actions に `NEXT_PUBLIC_YOUTUBE_API_KEY` を登録

`config/profile.ts` の `youtube.apiKey` への直接記載は非推奨です（リポジトリが公開されている場合、APIキーが漏洩するため）。

### X (Twitter) プロフィールの設定

X のプロフィール情報はAPI経由での取得ではなく、手動で `config/profile.ts` に設定します。X のプロフィールを変更した際は、設定ファイルも合わせて更新してください。

| 設定項目 | 説明 |
|---|---|
| `x.username` | X のユーザー名 |
| `x.bio` | X の自己紹介文（空の場合は `accounts` の `description` を表示） |
| `x.headerImagePath` | ヘッダーバナー画像のパス（`public/` に配置。未設定時は黒背景） |
| `x.pinnedPostUrls` | 固定ポストのURL一覧（oEmbed埋め込みで表示） |

アバター画像は `config.avatarPath`（全体共通）を使用します。

### Instagram の設定

| 設定項目 | 説明 |
|---|---|
| `instagram.isPrivate` | プライベートアカウントの場合は `true`（鍵アイコンと非公開注記を表示） |
| `instagram.embeddedPostUrls` | 埋め込みたい投稿のURL一覧（空配列の場合はプロフィールカードのみ表示） |

## ビルド

```bash
npm run build
```

`out/` ディレクトリに静的ファイルが生成されます。

## デプロイ

### 自動デプロイ

`main` ブランチにプッシュすると、GitHub Actions が自動でビルド・デプロイを行います。

### 手動デプロイ

1. GitHub リポジトリの **Actions** タブを開く
2. 左サイドバーから **Deploy to GitHub Pages** ワークフローを選択
3. **Run workflow** → ブランチを `main` に指定 → **Run workflow** を実行

### GitHub Pages の初期設定

1. リポジトリの Settings → Pages に移動
2. Source を「**GitHub Actions**」に設定

## 仕様書

詳細な設計仕様は `docs/SPECIFICATION.md` を参照してください。
