import Hero from "@/components/Hero";
import SnsLinks from "@/components/SnsLinks";
import XSection from "@/components/XSection";
import YouTubeSection from "@/components/YouTubeSection";
import BlueskyFeed from "@/components/BlueskyFeed";
import InstagramSection from "@/components/InstagramSection";
import GitHubSection from "@/components/GitHubSection";
import QiitaArticles from "@/components/QiitaArticles";
import Mixi2Link from "@/components/Mixi2Link";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <SnsLinks />
        <XSection />
        <YouTubeSection />
        <BlueskyFeed />
        <InstagramSection />
        <GitHubSection />
        <QiitaArticles />
        <Mixi2Link />
      </main>

      <Footer />
    </div>
  );
}
