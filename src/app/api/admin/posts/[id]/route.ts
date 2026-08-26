import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { postInputSchema } from "@/lib/admin-schemas";
import { prisma } from "@/lib/db";
import { conflictMessage } from "../route";

export const runtime = "nodejs";

const patchSchema = postInputSchema.partial();

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Ungültige Daten." },
      { status: 400 },
    );
  }
  const d = parsed.data;

  const existing = await prisma.post.findUnique({ where: { id }, select: { publishedAt: true } });
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Nicht gefunden." }, { status: 404 });
  }

  // Stamp publishedAt the first time a post goes live; keep it thereafter.
  let publishedAt: Date | null | undefined;
  if (d.status === "published") {
    publishedAt = existing.publishedAt ?? new Date();
  } else if (d.status === "draft") {
    publishedAt = null;
  }

  try {
    await prisma.post.update({
      where: { id },
      data: {
        slug: d.slug,
        title: d.title,
        excerpt: "excerpt" in d ? (d.excerpt ?? null) : undefined,
        coverUrl: "coverUrl" in d ? (d.coverUrl ?? null) : undefined,
        // Scalar list: undefined means "leave alone", an array replaces it.
        // No null-dance needed — unlike the nullable scalars above.
        galleryUrls: d.galleryUrls ?? undefined,
        contentHtml: d.contentHtml,
        status: d.status,
        publishedAt,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: conflictMessage(err) }, { status: 409 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Nicht gefunden." }, { status: 404 });
  }
}
