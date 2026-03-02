# Profile システム仕様書

## 1. 概要

### 1.1 システムの目的

本システムは、個人が運用する複数のSNSアカウントおよびメディアアカウントの情報を集約し、各サービスの最新アクティビティを閲覧者に提供するプロフィールページである。

### 1.2 想定閲覧者

各サービスのフォロワー。閲覧者はいずれかのサービス経由でこのページにアクセスし、他のサービスの活動状況も把握できることを期待している。

### 1.3 システム分類

静的Webサイト（Static Site）。サーバーサイド処理は不要であり、ビルド時に生成されたHTML/CSS/JSファイルをホスティングサービスから配信する。

---

## 2. 技術スタック

| 項目 | 選定 | バージョン |
|---|---|---|
| フレームワーク | Next.js (App Router, Static Export) | 16.1.1 |
| UIライブラリ | React | 19.2.3 |
| 言語 | TypeScript | 5.x |
| スタイリング | Tailwind CSS | 4.x |
| ホスティング | GitHub Pages | - |
| CI/CD | GitHub Actions | - |

### 2.1 Static Export の制約

`next.config.ts` において `output: "export"` を指定する。これにより以下の制約が発生する。

- API Routes は使用不可
- Server Actions は使用不可
- SSR（サーバーサイドレンダリング）は使用不可
- ミドルウェアは使用不可
- `next/image` の最適化は使用不可（`images.unoptimized: true` で回避）

外部サービスからのデータ取得は、レート制限のあるAPIについてはビルド時に実行するプリフェッチスクリプトで取得し、JSONファイルとして静的に配信する（第2.3節参照）。oEmbed埋め込みやWeb Componentによる表示はクライアントサイドで行う。

### 2.2 GitHub Pages デプロイ構成

- URL形式：`https://<username>.github.io/profile/`
- `basePath` および `assetPrefix` に `/profile` を設定（本番環境のみ）
- `public/.nojekyll` ファイルにより Jekyll 処理をバイパス
- GitHub Actions による自動デプロイ（`main` ブランチへの push をトリガー）

### 2.3 ビルド時データ取得（プリフェッチ）

レート制限のある外部API（YouTube、GitHub、Qiita）については、ビルド前に実行するプリフェッチスクリプト（`scripts/fetch-data.ts`）でデータを取得し、`public/data/` ディレクトリにJSONファイルとして出力する。クライアントサイドのコンポーネントはこのJSONファイルを読み込むことで、ページ表示時にAPIを呼び出さない。

**対象サービスと出力ファイル**：

| サービス | APIエンドポイント | 出力ファイル |
|---|---|---|
| YouTube | `googleapis.com/youtube/v3/search` | `public/data/youtube.json` |
| GitHub | `api.github.com/users/{username}/repos` | `public/data/github.json` |
| Qiita | `qiita.com/api/v2/users/{username}/items` | `public/data/qiita.json` |

**実行タイミング**：
- ローカル開発時：`npm run prefetch` で手動実行
- CI/CD：`npm run build` の前に自動実行（`package.json` の `prebuild` スクリプト）

**エラーハンドリング**：各APIの取得は独立して実行し、いずれかのAPIが失敗しても他のAPIの取得は継続する。失敗したAPIについてはエラーログを出力し、空のJSONファイルを生成する。クライアント側は空データを検知し、各サービスのプロフィールページへのリンクをフォールバックとして表示する。

---

## 3. ページ構成

シングルページ構成（SPA的なスクロールページ）とする。各サービスの情報はセクション単位で縦に配置する。

### 3.1 セクション一覧

| 順序 | セクションID | セクション名 | コンポーネント | 概要 |
|---|---|---|---|---|
| 1 | (header) | Hero | `Hero.tsx` | プロフィールヘッダー |
| 2 | links | Accounts | `SnsLinks.tsx` | 全サービスへのリンクカード |
| 3 | x | X (Twitter) | `XSection.tsx` | プロフィールカード + 固定ポスト |
| 4 | youtube | YouTube | `YouTubeSection.tsx` | 最新動画一覧 |
| 5 | bluesky | Bluesky | `BlueskyFeed.tsx` | 最新投稿フィード |
| 6 | instagram | Instagram | `InstagramSection.tsx` | プロフィールカード + 投稿埋め込み |
| 7 | github | GitHub | `GitHubSection.tsx` | リポジトリ一覧 + コントリビューション |
| 8 | qiita | Qiita | `QiitaArticles.tsx` | 最新記事一覧 |
| 9 | mixi2 | mixi2 | `Mixi2Link.tsx` | プロフィールリンク |
| 10 | (footer) | Footer | `Footer.tsx` | コピーライト |

### 3.2 セクション共通仕様

各セクション（Hero、Footer を除く）は `SectionWrapper` コンポーネントで包括する。

- セクションタイトル：`Cormorant Garamond` フォント、1.75rem、`stone-700` 色、下線区切り
- サマリーバッジ：セクションタイトル右側に表示。件数や状態を簡潔に示す（例：「最新 6 本」「リンクのみ」）
- セクション間隔：`mt-16`（4rem）

---

## 4. プロフィール設定

### 4.1 設定ファイル

`config/profile.ts` で全情報を一元管理する。アカウントの追加・変更・削除はこのファイルのみで完結する。

### 4.2 プロフィール情報

| 項目 | 値 | 備考 |
|---|---|---|
| displayName | HogeFuga | Heroセクションに表示 |
| bio | (空文字列) | 設定した場合、名前の下に表示 |
| avatarPath | /avatar.png | `public/` ディレクトリに配置。未配置の場合はイニシャルにフォールバック |

### 4.3 アカウント一覧

| ID | サービス名 | URL | ユーザー名 | 説明 | アイコン色 |
|---|---|---|---|---|---|
| x | X (Twitter) | https://x.com/hogefuga | @hogefuga | 日常のつぶやき・技術メモ | #000000 |
| youtube | YouTube | https://youtube.com/@hogefuga | @hogefuga | 技術解説・Vlog | #FF0000 |
| bluesky | Bluesky | https://bsky.app/profile/hogefuga.bsky.social | @hogefuga.bsky.social | 分散SNSでの発信 | #0085FF |
| instagram | Instagram | https://www.instagram.com/hogefuga | @hogefuga | 写真・日常の記録 | #E4405F |
| mixi2 | mixi2 | https://mixi.social/@hogefuga | @hogefuga | 身近な人との交流 | #F7931E |
| github | GitHub | https://github.com/hogefuga | hogefuga | OSS活動・個人プロジェクト | #181717 |
| qiita | Qiita | https://qiita.com/hogefuga | hogefuga | 技術記事の投稿 | #55C500 |

---

## 5. 各セクション詳細仕様

### 5.1 Hero セクション

**コンポーネント**：`Hero.tsx`（Client Component）

**表示内容**：
- アバター画像：幅112px、円形、`stone-200` 背景、`stone-300` ボーダー
- ハンドルネーム：`Cormorant Garamond` フォント、4xl〜5xl、`stone-800` 色
- 紹介文：`bio` が空でない場合のみ表示。`stone-500` 色、最大幅 `lg`
- プラットフォーム数バッジ：「7 platforms」のようなサマリーバッジ

**背景**：`stone-100` → `stone-50` のグラデーション。上端に `stone-300` のアクセントライン。

**フォールバック**：アバター画像が存在しない場合、`displayName` の先頭1文字をイニシャルとして表示する。

### 5.2 Accounts セクション

**コンポーネント**：`SnsLinks.tsx`（Server Component）

**表示内容**：
- `config.accounts` 配列の各アカウントをリンクカードとして表示
- 2カラムグリッド（モバイルは1カラム）
- 各カード構成：アイコン（サービス名先頭1文字、背景色はアカウント定義の `iconColor`）、サービス名、ユーザー名、説明文、矢印アイコン
- カードクリックで各サービスのプロフィールURLを新しいタブで開く

### 5.3 X (Twitter) セクション

**コンポーネント**：`XSection.tsx`（Client Component）

**連携方式**：Xプロフィール風カード（自前レンダリング）+ 固定ポストの oEmbed 埋め込み

**変更理由**：X のタイムライン埋め込みウィジェットはAPI制限の影響で表示が不安定なため、Xのプロフィール画面を模したカード + 個別ポスト埋め込みに変更した。個別ポストの oEmbed はAPI制限の対象外であり安定して動作する。

**認証**：不要

**データ取得方針**：X APIのFree tierはレート制限が厳しく、またBearer Tokenをクライアントサイドに埋め込むことはセキュリティリスクが高いため、プロフィール情報はすべて `config/profile.ts` に手動で設定する。Xのプロフィールを変更した際は、設定ファイルも合わせて更新する運用とする。

**プロフィールカードデザイン**：Xのプロフィール画面を模したレイアウトとする。
- ヘッダーバナー：高さ 120px、黒背景（`#000000`）。`config.x.headerImagePath` が設定されている場合はその画像を表示
- プロフィール画像：幅68px、円形、白ボーダー（3px）、バナー下端から上半分が重なる位置に配置。アバター画像は `config.avatarPath`（共通）を使用。画像がない場合はイニシャル表示
- 表示名：太字、`stone-900` 色
- ユーザー名：`@username` 形式、`stone-500` 色
- 自己紹介文：`config.x.bio` を表示。未設定時は `config.accounts` の説明文にフォールバック。`stone-700` 色
- プロフィールページへのリンク：カード全体をクリッカブルにし、新しいタブで開く

**固定ポスト**：
- `config.x.pinnedPostUrls` に登録されたURLの投稿を oEmbed 埋め込みで表示
- 固定ポストが未設定の場合：プロフィールカードのみ表示

**スクリプト管理**：`platform.twitter.com/widgets.js` は固定ポストがある場合のみ読み込み。既に読み込まれている場合は `twttr.widgets.load()` で再レンダリング

### 5.4 YouTube セクション

**コンポーネント**：`YouTubeSection.tsx`（Client Component）

**連携方式**：YouTube Data API v3（ビルド時プリフェッチ → `public/data/youtube.json` をクライアントが読み込み）

**認証**：APIキーが必要。環境変数 `NEXT_PUBLIC_YOUTUBE_API_KEY` から取得する（`config.youtube.apiKey` にも設定可能だが非推奨）。

**APIキー管理方針**：

クライアントサイドで使用するAPIキーは、ビルド後のJavaScriptに埋め込まれるため完全な秘匿は不可能である。そのため、APIキー自体の隠蔽ではなく、Google Cloud Console側での利用制限によりセキュリティを確保する。

- **HTTPリファラ制限**：`https://<username>.github.io/profile/*` のみ許可
- **API制限**：YouTube Data API v3 のみ利用可能に限定

APIキーの保管場所は以下のとおりとする。

- ローカル開発時：`.env.local` ファイルに `NEXT_PUBLIC_YOUTUBE_API_KEY=YOUR_KEY` を記載（`.gitignore` に含まれるためコミットされない）
- GitHub Actionsでのビルド時：リポジトリの Settings → Secrets and variables → Actions に `NEXT_PUBLIC_YOUTUBE_API_KEY` を登録
- `config/profile.ts` の `youtube.apiKey` には値を設定しない（空文字列のまま運用する）

**API仕様**：
- エンドポイント：`https://www.googleapis.com/youtube/v3/search`
- パラメータ：`part=snippet`, `channelId`, `maxResults=6`, `order=date`, `type=video`
- 取得件数：最大6件

**表示内容**：
- 2カラムグリッド（モバイルは1カラム）
- 各カード：サムネイル画像、動画タイトル（2行まで）、投稿日
- カードクリックでYouTubeの動画ページを新しいタブで開く

**エラー処理**：
- APIキーまたはチャンネルIDが未設定の場合：「YouTube API キーまたはチャンネルIDが未設定です」を表示し、YouTubeチャンネルへのリンクを提示
- API取得失敗時：エラーメッセージを表示し、YouTubeチャンネルへのリンクを提示

**ローディング**：4枚分のスケルトンカードを表示

### 5.5 Bluesky セクション

**コンポーネント**：`BlueskyFeed.tsx`（Client Component）

**連携方式**：`bsky-embed` Web Component（`cdn.jsdelivr.net/npm/bsky-embed`）

**認証**：不要

**表示内容**：
- 最新投稿5件をフィード形式で表示
- テーマ：light

**スクリプト管理**：`bsky-embed.es.js` は1度のみ読み込み（`type="module"`, `async`）

**ローディング**：スケルトンローディング（高さ400px）を表示

### 5.6 Instagram セクション

**コンポーネント**：`InstagramSection.tsx`（Client Component）

**連携方式**：Instagramプロフィール風カード（自前レンダリング）

**変更理由**：プライベートアカウントの場合、oEmbed 埋め込みやAPIによるフィード取得はいずれも動作しない。そのため、Instagramのプロフィール画面を模したカード形式に変更した。

**認証**：不要

**プロフィールカードデザイン**：Instagramのプロフィール画面を模したレイアウトとする。
- プロフィール画像：幅80px、円形、Instagram特有のグラデーションボーダー（ピンク〜オレンジ〜紫）。画像がない場合はイニシャル表示
- ユーザー名：太字、ユーザー名の横に鍵アイコン（非公開時）
- 自己紹介文：`config.accounts` の説明文を表示、`stone-700` 色
- 非公開アカウント注記：`config.instagram.isPrivate` が true の場合、「このアカウントは非公開です」の注記と鍵アイコンを表示
- プロフィールページへのリンク：カード全体をクリッカブルにし、新しいタブで開く

**投稿埋め込み**：
- `config.instagram.embeddedPostUrls` に登録されたURLの投稿を、プロフィールカードの下に oEmbed 埋め込みで表示
- 投稿は中央揃え、横幅上限 400px
- URLが未登録（空配列）の場合：プロフィールカードのみ表示

**スクリプト管理**：`instagram.com/embed.js` は埋め込みURLがある場合のみ読み込み。既に読み込まれている場合は `instgrm.Embeds.process()` で再レンダリング

### 5.7 GitHub セクション

**コンポーネント**：`GitHubSection.tsx`（Client Component）

**連携方式**：
1. コントリビューションカレンダー：`ghchart.rshah.org` の画像埋め込み
2. リポジトリ一覧：GitHub REST API（ビルド時プリフェッチ → `public/data/github.json` をクライアントが読み込み）

**認証**：不要（公開APIのみ使用。レート制限は未認証で60回/時だが、ビルド時のみの呼び出しのため問題なし）

**API仕様（リポジトリ一覧）**：
- エンドポイント：`https://api.github.com/users/{username}/repos`
- パラメータ：`sort=updated`, `per_page=6`, `type=owner`
- 取得件数：最大6件

**表示内容**：
- コントリビューションカレンダー：全幅画像、横スクロール対応、カラースキーム `#44403c`
- リポジトリ一覧：2カラムグリッド（モバイルは1カラム）
- 各カード：リポジトリ名、説明（2行まで）、使用言語（ドット色付き）、スター数、フォーク数
- 「すべてのリポジトリを見る →」リンク

**言語カラー**：TypeScript (#3178C6)、JavaScript (#F7DF1E)、Python (#3572A5)、Rust (#DEA584)、Go (#00ADD8)、Java (#B07219)、C# (#178600)、Ruby (#701516)、HTML (#E34C26)、CSS (#563D7C)、Shell (#89E051)。未定義言語は #8B8B8B。

**エラー処理**：API取得失敗時はエラーメッセージを表示

**ローディング**：4枚分のスケルトンカードを表示

### 5.8 Qiita セクション

**コンポーネント**：`QiitaArticles.tsx`（Client Component）

**連携方式**：Qiita API v2（ビルド時プリフェッチ → `public/data/qiita.json` をクライアントが読み込み）

**認証**：不要（公開APIのみ使用。ビルド時のみの呼び出しのためレート制限の影響なし）

**API仕様**：
- エンドポイント：`https://qiita.com/api/v2/users/{username}/items`
- パラメータ：`per_page=6`
- 取得件数：最大6件

**表示内容**：
- 縦積みリスト
- 各カード：記事タイトル（1行まで）、投稿日、いいね数、タグ（最大3つ）
- 「すべての記事を見る →」リンク

**エラー処理**：API取得失敗時はエラーメッセージとQiitaプロフィールへのリンクを表示

**ローディング**：4件分のスケルトンカードを表示

### 5.9 mixi2 セクション

**コンポーネント**：`Mixi2Link.tsx`（Server Component）

**連携方式**：プロフィールリンクのみ（API未公開のため）

**表示内容**：
- 「mixi2 は現在、外部への埋め込み機能やAPIが公開されていないため、プロフィールリンクのみ掲載しています。」という説明文
- プロフィールへのリンクカード

**サマリーバッジ**：「リンクのみ」

### 5.10 Footer セクション

**コンポーネント**：`Footer.tsx`（Server Component）

**表示内容**：
- コピーライト表記：`© {現在年} {displayName}. All rights reserved.`
- `stone-200` のトップボーダー、上余白 `mt-20`

---

## 6. デザイン仕様

### 6.1 配色

ライトモードベース。stone 系カラーパレットを基調としたシックで落ち着いた配色。

| 用途 | 色 | 色コード |
|---|---|---|
| 背景（ページ） | stone-50 | #fafaf9 |
| 背景（カード） | white | #ffffff |
| テキスト（主） | stone-800 | #292524 |
| テキスト（副） | stone-500 | #78716c |
| テキスト（淡） | stone-400 | #a8a29e |
| ボーダー | stone-200 | #e7e5e4 |
| セクションタイトル | stone-700 | #44403c |
| バッジ背景 | stone-100 | #f5f5f4 |

### 6.2 タイポグラフィ

| 用途 | フォント | サイズ |
|---|---|---|
| 見出し・表示名 | Cormorant Garamond (500) | 1.75rem（セクション）/ 2.25-3rem（Hero） |
| 本文 | Noto Sans JP (300-600) | 0.875rem 基本 |
| バッジ・ラベル | Noto Sans JP (500) | 0.8125rem |

### 6.3 カードスタイル

- 背景：白
- ボーダー：`stone-200`（1px solid）
- 角丸：0.5rem
- パディング：1.5rem
- ホバー時：`box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06)` + ボーダー色が `stone-300` に変化

### 6.4 リンクカードスタイル

- flexbox 横並び
- ホバー時：1px上に移動（`translateY(-1px)`）+ 影 + ボーダー色変化
- アイコン：2.5rem角、角丸0.375rem、サービスごとの背景色

### 6.5 ローディング（スケルトン）

- `stone-100` → `stone-200` → `stone-100` のグラデーションアニメーション（shimmer）
- 1.5秒周期
- 角丸0.375rem

### 6.6 レスポンシブ

- 最大幅：`max-w-4xl`（56rem / 896px）
- ブレークポイント：`sm:` (640px) でグリッドカラム数を切り替え
- グリッド：モバイル1カラム → `sm` 以上で2カラム

---

## 7. ファイル構成

```
profile/
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions デプロイ設定
├── app/
│   ├── globals.css               # グローバルスタイル（Tailwind + カスタム）
│   ├── layout.tsx                # ルートレイアウト（メタデータ、フォント読み込み）
│   └── page.tsx                  # トップページ（全セクション配置）
├── components/
│   ├── BlueskyFeed.tsx           # Bluesky フィード
│   ├── Footer.tsx                # フッター
│   ├── GitHubSection.tsx         # GitHub リポジトリ + コントリビューション
│   ├── Hero.tsx                  # プロフィールヘッダー
│   ├── InstagramSection.tsx      # Instagram プロフィールカード
│   ├── Mixi2Link.tsx             # mixi2 リンク
│   ├── QiitaArticles.tsx         # Qiita 記事一覧
│   ├── SectionWrapper.tsx        # セクション共通ラッパー
│   ├── SnsLinks.tsx              # リンクカード一覧
│   ├── XSection.tsx              # X プロフィールカード + 固定ポスト
│   └── YouTubeSection.tsx        # YouTube 最新動画
├── config/
│   └── profile.ts                # プロフィール設定（一元管理）
├── scripts/
│   └── fetch-data.ts             # ビルド時データ取得スクリプト
├── public/
│   ├── .nojekyll                 # Jekyll バイパス
│   ├── data/                     # ビルド時取得データ（.gitignore対象）
│   │   ├── youtube.json          # YouTube 最新動画
│   │   ├── github.json           # GitHub リポジトリ一覧
│   │   └── qiita.json            # Qiita 記事一覧
│   └── avatar.png                # アバター画像（任意配置）
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts                # Next.js 設定（Static Export + basePath）
├── package.json
├── postcss.config.js
├── README.md
└── tsconfig.json
```

---

## 8. CI/CD

### 8.1 GitHub Actions ワークフロー

**ファイル**：`.github/workflows/deploy.yml`

**トリガー**：
- `main` ブランチへの push
- 手動実行（`workflow_dispatch`）

**ジョブ構成**：

1. **build**
   - `ubuntu-latest` ランナー
   - Node.js 20 セットアップ
   - `npm ci` で依存関係インストール
   - `npm run prefetch` でビルド時データ取得（YouTube・GitHub・Qiita）
   - `npm run build`（`NODE_ENV=production`）—— `prebuild` スクリプトにより `prefetch` が自動実行される
   - ビルド時環境変数：`NEXT_PUBLIC_YOUTUBE_API_KEY` を GitHub Actions Secrets から注入
   - `./out` ディレクトリを Pages アーティファクトとしてアップロード

2. **deploy**
   - build ジョブ完了後に実行
   - `actions/deploy-pages@v4` で GitHub Pages にデプロイ

**権限**：
- `contents: read`
- `pages: write`
- `id-token: write`

### 8.2 GitHub Pages 設定

リポジトリの Settings → Pages で Source を「GitHub Actions」に設定する必要がある。

---

## 9. 外部依存サービス

| サービス | 用途 | 認証 | レート制限 | フォールバック |
|---|---|---|---|---|
| X widgets.js | 固定ポスト oEmbed 埋め込み | 不要 | なし（oEmbed） | プロフィールカードのみ表示 |
| YouTube Data API v3 | 最新動画取得（ビルド時プリフェッチ） | APIキー必要（環境変数で管理） | 10,000ユニット/日（ビルド時のみ消費） | 空JSON → リンク表示 |
| bsky-embed (jsdelivr CDN) | Blueskyフィード表示 | 不要 | なし | スケルトン表示 |
| Instagram embed.js | 投稿 oEmbed 埋め込み（URL指定時のみ） | 不要 | なし | プロフィールカードのみ表示 |
| GitHub REST API | リポジトリ一覧取得（ビルド時プリフェッチ） | 不要 | 60回/時（ビルド時のみ消費） | 空JSON → エラーメッセージ |
| ghchart.rshah.org | コントリビューションカレンダー | 不要 | なし | 画像読み込み失敗時はalt表示 |
| Qiita API v2 | 記事一覧取得（ビルド時プリフェッチ） | 不要 | レート制限あり（ビルド時のみ消費） | 空JSON → リンク表示 |
| Google Fonts | Webフォント配信 | 不要 | なし | システムフォントにフォールバック |

---

## 10. 変更履歴

| 日付 | バージョン | 変更内容 |
|---|---|---|
| 2025-02-10 | 1.0.0 | 初版作成 |
| 2025-02-10 | 1.0.1 | YouTube APIキー管理方針を追加（第5.4節、第8.1節、第9章）、GitHub Actionsに環境変数注入を追加 |
| 2025-02-10 | 1.1.0 | Xセクションをタイムライン埋め込みからX風プロフィールカード+固定ポストに変更、InstagramセクションをoEmbed埋め込みからInstagram風プロフィールカードに変更（第3.1節、第5.3節、第5.6節、第7章、第9章） |
| 2025-02-10 | 1.1.1 | Xプロフィール情報の手動管理方針を明記、`x.bio` プロパティを追加（第5.3節） |
| 2025-02-10 | 1.1.2 | Instagramセクションに投稿埋め込み機能を復元。プロフィールカード + URL指定時の投稿oEmbed埋め込みの併用構成に変更（第3.1節、第5.6節、第9章） |
| 2025-02-26 | 1.2.0 | レート制限のあるAPI（YouTube・GitHub・Qiita）をビルド時プリフェッチ方式に変更。`scripts/fetch-data.ts` でデータを取得し `public/data/` にJSONとして出力（第2.1節、第2.3節、第5.4節、第5.7節、第5.8節、第7章、第8.1節、第9章） |
