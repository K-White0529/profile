import config from "@/config/profile";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 py-8 mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs text-stone-400">
          &copy; {year} {config.displayName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
