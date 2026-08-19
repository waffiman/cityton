"use client";

import { usePathname } from "next/navigation";

/**
 * Renders the public site header/footer around page content, except on the
 * admin panel (/admin/**), which supplies its own full-screen shell.
 * Header/footer are passed as already-rendered server nodes.
 */
export default function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname?.startsWith("/admin/");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <a className="skip-link" href="#inhalt">
        Zum Inhalt springen
      </a>
      {header}
      <main id="inhalt">{children}</main>
      {footer}
    </>
  );
}
