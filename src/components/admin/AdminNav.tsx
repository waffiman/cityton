"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/app/admin/admin.module.css";

type Item = { href: string; label: string };
type Group = { label: string; items: Item[] };

const GROUPS: Group[] = [
  {
    label: "Übersicht",
    items: [{ href: "/admin", label: "Dashboard" }],
  },
  {
    label: "Katalog",
    items: [
      { href: "/admin/products", label: "Produkte" },
      { href: "/admin/categories", label: "Serien" },
      { href: "/admin/producers", label: "Hersteller" },
    ],
  },
  {
    label: "CRM & Inhalte",
    items: [
      { href: "/admin/inquiries", label: "Anfragen" },
      { href: "/admin/posts", label: "Blog" },
      { href: "/admin/gallery", label: "Galerie" },
    ],
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className={styles.nav}>
      {GROUPS.map((group) => (
        <div key={group.label}>
          <p className={styles.navGroupLabel}>{group.label}</p>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
