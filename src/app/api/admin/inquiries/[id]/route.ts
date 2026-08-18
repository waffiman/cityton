import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const patchSchema = z.object({
  status: z.enum(["new", "in_progress", "done", "archived"]).optional(),
  notes: z.string().max(5000).optional(),
});

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
    return NextResponse.json({ ok: false, error: "Ungültige Daten." }, { status: 400 });
  }
  try {
    const updated = await prisma.inquiry.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ ok: true, inquiry: { id: updated.id, status: updated.status } });
  } catch {
    return NextResponse.json({ ok: false, error: "Nicht gefunden." }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await prisma.inquiry.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Nicht gefunden." }, { status: 404 });
  }
}
