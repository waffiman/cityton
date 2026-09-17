import Link from "next/link";
import { notFound } from "next/navigation";
import InquiryEditor from "@/components/admin/InquiryEditor";
import { prisma } from "@/lib/db";
import deMessages from "@/messages/de.json";
import styles from "../../../admin.module.css";

const SOURCE_LABEL: Record<string, string> = {
  kontakt: "Kontaktformular",
  beratung: "Schnellanfrage",
  partner: "B2B-Partnerschaft",
  chatbot: "Chatbot",
};

const OBJEKT_LABEL = new Map<string, string>(Object.entries(deMessages.kontakt.objectTypes));
const GOAL_LABEL = new Map<string, string>(Object.entries(deMessages.kontakt.goals));
/** Current + legacy interest keys stored in Inquiry.goals for source=partner. */
const INTEREST_LABEL = new Map<string, string>([
  ...Object.entries(deMessages.partner.interests),
  ["empfehlung", deMessages.partner.interests.recommendation],
  ["projekte", deMessages.partner.interests.project],
  ["sonstige", deMessages.partner.interests.other],
]);

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("de-AT", { dateStyle: "long", timeStyle: "short" }).format(d);
}

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const q = await prisma.inquiry.findUnique({ where: { id } });
  if (!q) notFound();

  const isPartner = q.source === "partner";
  let branche = "";
  let message = q.message ?? "";
  if (isPartner && message.startsWith("Branche: ")) {
    const split = message.indexOf("\n\n");
    if (split === -1) {
      branche = message.slice("Branche: ".length);
      message = "";
    } else {
      branche = message.slice("Branche: ".length, split);
      message = message.slice(split + 2);
    }
  }

  const rows: { label: string; value: string }[] = [
    { label: "Eingegangen", value: formatDate(q.createdAt) },
    { label: "Quelle", value: SOURCE_LABEL[q.source] ?? q.source },
    { label: "Name", value: q.name || "—" },
    { label: "E-Mail", value: q.email || "—" },
    { label: "Telefon", value: q.phone || "—" },
    {
      label: isPartner ? "Unternehmen" : "Objektart",
      value: q.objektart
        ? isPartner
          ? q.objektart
          : (OBJEKT_LABEL.get(q.objektart) ?? q.objektart)
        : "—",
    },
    {
      label: isPartner ? "Website" : "Fläche",
      value: q.flaeche || "—",
    },
    {
      label: isPartner ? "Interesse" : "Ziele",
      value:
        q.goals.length > 0
          ? q.goals
              .map((g) => (isPartner ? (INTEREST_LABEL.get(g) ?? g) : (GOAL_LABEL.get(g) ?? g)))
              .join(", ")
          : "—",
    },
  ];
  if (isPartner && branche) rows.push({ label: "Branche", value: branche });
  if (message) rows.push({ label: "Nachricht", value: message });

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>{q.name || "Anfrage"}</h1>
          <p className={styles.pageLead}>
            <Link href="/admin/inquiries" className={styles.rowLink}>
              ← Alle Anfragen
            </Link>
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gap: "var(--space-8)", gridTemplateColumns: "1fr", maxWidth: 720 }}>
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <th style={{ width: 160 }}>{r.label}</th>
                  <td>{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <InquiryEditor id={q.id} initialStatus={q.status} initialNotes={q.notes ?? ""} />
      </div>
    </>
  );
}
