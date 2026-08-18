"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/app/admin/admin.module.css";

/**
 * Inline show/hide toggle. PATCHes { visible } to the given endpoint.
 */
export default function VisibleToggle({
  endpoint,
  initial,
}: {
  endpoint: string;
  initial: boolean;
}) {
  const router = useRouter();
  const [visible, setVisible] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    const next = !visible;
    setBusy(true);
    setVisible(next);
    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: next }),
    });
    setBusy(false);
    if (!res.ok) {
      setVisible(!next); // revert
    } else {
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={`${styles.badge} ${visible ? styles.badgeOn : styles.badgeOff}`}
      style={{ cursor: "pointer" }}
      title="Sichtbarkeit umschalten"
    >
      {visible ? "Sichtbar" : "Verborgen"}
    </button>
  );
}
