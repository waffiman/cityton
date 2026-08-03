import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@/lib/analytics";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
