/**
 * ビルド時データ取得スクリプト（プリフェッチ）
 *
 * レート制限のある外部API（YouTube・GitHub・Qiita）からデータを取得し、
 * public/data/ ディレクトリにJSONファイルとして出力する。
 * クライアントサイドのコンポーネントはこのJSONを読み込むことで、
 * ページ表示時にAPIを呼び出さない。
 *
 * 実行: npx tsx scripts/fetch-data.ts
 */

import * as fs from "fs";
import * as path from "path";

// config/profile.ts からの設定読み込み（ESM対応）
// スクリプト単体実行のため、config の値を直接参照する
import config from "../config/profile";

const DATA_DIR = path.join(process.cwd(), "public", "data");

/** 出力ディレクトリを作成 */
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log(`[prefetch] Created ${DATA_DIR}`);
  }
}

/** JSONファイルを書き出す */
function writeJson(filename: string, data: unknown): void {
  const filepath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`[prefetch] Wrote ${filepath}`);
}

// ============================================================
// YouTube Data API v3
// ============================================================

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

async function fetchYouTube(): Promise<void> {
  const apiKey =
    config.youtube.apiKey || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "";
  const channelId = config.youtube.channelId;

  if (!apiKey || !channelId) {
    console.warn(
      "[prefetch] YouTube: APIキーまたはチャンネルIDが未設定のためスキップ"
    );
    writeJson("youtube.json", { videos: [], fetchedAt: new Date().toISOString(), error: "APIキーまたはチャンネルIDが未設定です" });
    return;
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=6&order=date&type=video&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    const videos: YouTubeVideo[] = data.items.map(
      (item: {
        id: { videoId: string };
        snippet: {
          title: string;
          thumbnails: { medium: { url: string } };
          publishedAt: string;
        };
      }) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
      })
    );
    writeJson("youtube.json", {
      videos,
      fetchedAt: new Date().toISOString(),
    });
    console.log(`[prefetch] YouTube: ${videos.length} 件取得`);
  } catch (err) {
    console.error(`[prefetch] YouTube: 取得失敗 -`, err);
    writeJson("youtube.json", { videos: [], fetchedAt: new Date().toISOString(), error: String(err) });
  }
}

// ============================================================
// GitHub REST API
// ============================================================

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

async function fetchGitHub(): Promise<void> {
  const username = config.github.username;

  if (!username) {
    console.warn("[prefetch] GitHub: ユーザー名が未設定のためスキップ");
    writeJson("github.json", { repos: [], fetchedAt: new Date().toISOString(), error: "ユーザー名が未設定です" });
    return;
  }

  try {
    const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=6&type=owner`;
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data: GitHubRepo[] = await res.json();
    const repos = data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      updated_at: repo.updated_at,
    }));
    writeJson("github.json", {
      repos,
      fetchedAt: new Date().toISOString(),
    });
    console.log(`[prefetch] GitHub: ${repos.length} リポジトリ取得`);
  } catch (err) {
    console.error(`[prefetch] GitHub: 取得失敗 -`, err);
    writeJson("github.json", { repos: [], fetchedAt: new Date().toISOString(), error: String(err) });
  }
}

// ============================================================
// Qiita API v2
// ============================================================

interface QiitaArticle {
  id: string;
  title: string;
  url: string;
  likes_count: number;
  tags: { name: string }[];
  created_at: string;
}

async function fetchQiita(): Promise<void> {
  const username = config.qiita.username;

  if (!username) {
    console.warn("[prefetch] Qiita: ユーザー名が未設定のためスキップ");
    writeJson("qiita.json", { articles: [], fetchedAt: new Date().toISOString(), error: "ユーザー名が未設定です" });
    return;
  }

  try {
    const url = `https://qiita.com/api/v2/users/${username}/items?per_page=6`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data: QiitaArticle[] = await res.json();
    const articles = data.map((article) => ({
      id: article.id,
      title: article.title,
      url: article.url,
      likes_count: article.likes_count,
      tags: article.tags,
      created_at: article.created_at,
    }));
    writeJson("qiita.json", {
      articles,
      fetchedAt: new Date().toISOString(),
    });
    console.log(`[prefetch] Qiita: ${articles.length} 記事取得`);
  } catch (err) {
    console.error(`[prefetch] Qiita: 取得失敗 -`, err);
    writeJson("qiita.json", { articles: [], fetchedAt: new Date().toISOString(), error: String(err) });
  }
}

// ============================================================
// メイン処理
// ============================================================

async function main(): Promise<void> {
  console.log("[prefetch] ビルド時データ取得を開始...");
  ensureDataDir();

  // 各APIを並列で取得（いずれかが失敗しても他は継続）
  const results = await Promise.allSettled([
    fetchYouTube(),
    fetchGitHub(),
    fetchQiita(),
  ]);

  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    console.warn(`[prefetch] ${failed.length} 件のAPI取得で予期しないエラーが発生`);
  }

  console.log("[prefetch] 完了");
}

main();
