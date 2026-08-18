import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import styles from "../admin.module.css";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Admin data is always live.
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const authed = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!authed) redirect("/admin/login");

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div>
          <Link href="/admin" className={styles.brand}>
            City-Ton
            <span className={styles.brandSub}>Admin</span>
          </Link>
        </div>
        <AdminNav />
        <div className={styles.sidebarFoot}>
          <Link href="/" className={styles.navLink} target="_blank">
            Website ansehen ↗
          </Link>
          <LogoutButton />
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
