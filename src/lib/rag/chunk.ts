/**
 * Dependency-free recursive character splitter (LangChain-style separators).
 * Splits on the coarsest separator that keeps pieces under `chunkSize`, then
 * overlaps neighbouring chunks so sentences on a boundary are not lost.
 */

const SEPARATORS = ["\n\n", "\n", ". ", "; ", ", ", " ", ""] as const;

export type ChunkOptions = {
  chunkSize?: number;
  chunkOverlap?: number;
};

function splitOnce(text: string, separator: string): string[] {
  if (!separator) return Array.from(text);
  return text.split(separator).filter((p) => p.length > 0);
}

function mergeWithOverlap(
  pieces: string[],
  separator: string,
  chunkSize: number,
  chunkOverlap: number,
): string[] {
  const out: string[] = [];
  let current = "";

  const join = (a: string, b: string) => (a ? `${a}${separator}${b}` : b);

  for (const piece of pieces) {
    const candidate = join(current, piece);
    if (candidate.length <= chunkSize) {
      current = candidate;
      continue;
    }
    if (current) out.push(current);

    if (piece.length > chunkSize) {
      // Piece itself is oversized — hand back and let a finer separator handle it.
      out.push(...splitRecursive(piece, chunkSize, chunkOverlap, true));
      current = "";
      continue;
    }

    // Overlap: keep the tail of the previous chunk as the start of the next.
    if (chunkOverlap > 0 && current) {
      const tail = current.slice(Math.max(0, current.length - chunkOverlap));
      current = join(tail, piece);
      if (current.length > chunkSize) current = piece;
    } else {
      current = piece;
    }
  }
  if (current) out.push(current);
  return out;
}

function splitRecursive(
  text: string,
  chunkSize: number,
  chunkOverlap: number,
  fromOversize = false,
): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.length <= chunkSize) return [trimmed];

  const seps = fromOversize ? SEPARATORS.slice(1) : SEPARATORS;
  for (const separator of seps) {
    const parts = splitOnce(trimmed, separator);
    if (parts.length === 1 && separator !== "") continue;
    if (separator === "") {
      // Last resort: hard-cut by character with overlap.
      const hard: string[] = [];
      for (let i = 0; i < trimmed.length; i += chunkSize - chunkOverlap) {
        hard.push(trimmed.slice(i, i + chunkSize));
        if (i + chunkSize >= trimmed.length) break;
      }
      return hard;
    }
    return mergeWithOverlap(parts, separator, chunkSize, chunkOverlap);
  }
  return [trimmed];
}

/** Split `text` into overlapping chunks of at most `chunkSize` characters. */
export function splitText(text: string, options: ChunkOptions = {}): string[] {
  const chunkSize = options.chunkSize ?? 1000;
  const chunkOverlap = Math.min(options.chunkOverlap ?? 150, chunkSize - 1);
  return splitRecursive(text, chunkSize, chunkOverlap);
}
