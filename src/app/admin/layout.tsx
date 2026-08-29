import { Inter } from "next/font/google";
import "../globals.css";

// The admin panel isn't part of the `[locale]` route tree (it's excluded from
// locale routing in src/proxy.ts and stays untranslated), so with the public
// root layout now living at src/app/[locale]/layout.tsx, this is the only
// <html>/<body> ancestor admin routes have — Next's "multiple root layouts"
// pattern (sibling top-level segments with no shared layout.tsx above them).
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
