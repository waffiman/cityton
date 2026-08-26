import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { postInputSchema } from "@/lib/admin-schemas";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export function conflictMessage(err: unknown): string {
  const code = (err as { code?: string })?.code;
  if (code === "P2002") return "Slug ist bereits vergeben.";
  return "Speichern fehlgeschlagen.";
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }
  const parsed = postInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Ungültige Daten." },
      { status: 400 },
    );
  }
  const d = parsed.data;
  try {
    const created = await prisma.post.create({
      data: {
        slug: d.slug,
        title: d.title,
        excerpt: d.excerpt ?? null,
        coverUrl: d.coverUrl ?? null,
        galleryUrls: d.galleryUrls ?? [],
        contentHtml: d.contentHtml,
        status: d.status,
        publishedAt: d.status === "published" ? new Date() : null,
      },
    });
    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    return NextResponse.json({ ok: false, error: conflictMessage(err) }, { status: 409 });
  }
}
