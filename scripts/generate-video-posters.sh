#!/usr/bin/env bash
#
# generate-video-posters.sh — first-frame stills for gallery grid videos.
#
# Grid video tiles don't autoplay on mobile (see MutedLoopVideo in
# GalleryMasonry.tsx) and preload="metadata" alone doesn't guarantee a
# decoded frame, so without a poster the tile is blank until tapped. This
# extracts one JPEG per clip in public/media/referenzen/*.mp4 into
# public/media/video-posters/, matched by filename via src/lib/gallery-media.ts.
#
# Run again whenever a video is added to public/media/referenzen/. Requires
# ffmpeg (brew install ffmpeg).
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$DIR/public/media/referenzen"
OUT="$DIR/public/media/video-posters"
mkdir -p "$OUT"

shopt -s nullglob
for f in "$SRC"/*.mp4; do
  base="$(basename "$f" .mp4)"
  ffmpeg -y -ss 00:00:00.5 -i "$f" -frames:v 1 -vf "scale=800:-1" -q:v 4 "$OUT/$base.jpg"
  echo "-> $OUT/$base.jpg"
done
