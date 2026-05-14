#!/usr/bin/env bash
# Sync each team member's avatar (Slack image_512 / local path) into the
# monday board 1879224155 Photo column (file_mm0vp797). Reads tokens from
# .env.local. Skips entries without a numeric monday item id (e.g. the
# Sanity-only Aquib placeholder).
#
# Usage:  bash scripts/sync-photos-to-monday.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
set -a
# shellcheck disable=SC1091
source .env.local
set +a

if [[ -z "${MONDAY_API_TOKEN:-}" ]]; then
  echo "MONDAY_API_TOKEN missing in .env.local" >&2
  exit 1
fi

BOARD_ID=1879224155
COLUMN_ID=file_mm0vp797
TMP_DIR=$(mktemp -d -t monday-photos-XXXXXX)
trap 'rm -rf "$TMP_DIR"' EXIT

# Extract id + photoUrl pairs from teamRoster.ts via Node.
node --input-type=module -e '
import fs from "node:fs";
const src = fs.readFileSync("src/data/teamRoster.ts", "utf8");
const matches = [...src.matchAll(/id:\s*"(\d+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?photoUrl:\s*"([^"]+)"/g)];
for (const m of matches) {
  process.stdout.write(`${m[1]}\t${m[2]}\t${m[3]}\n`);
}
' > "$TMP_DIR/roster.tsv"

count=$(wc -l < "$TMP_DIR/roster.tsv" | tr -d " ")
echo "Found $count members with photos."

i=0
while IFS=$'\t' read -r ITEM_ID NAME URL; do
  i=$((i+1))
  EXT="${URL##*.}"
  EXT="${EXT%%\?*}"
  case "$EXT" in
    jpg|jpeg|png|gif|webp) ;;
    *) EXT=jpg ;;
  esac
  FILE="$TMP_DIR/${ITEM_ID}.${EXT}"

  if [[ "$URL" == /images/* ]]; then
    cp "public${URL}" "$FILE"
  else
    curl -sL --max-time 30 -o "$FILE" "$URL" || { echo "[$i/$count] $NAME — download failed, skipping"; continue; }
  fi

  if [[ ! -s "$FILE" ]]; then
    echo "[$i/$count] $NAME — empty file, skipping"
    continue
  fi

  QUERY="mutation (\$file: File!) { add_file_to_column (item_id: $ITEM_ID, column_id: \"$COLUMN_ID\", file: \$file) { id } }"
  RESP=$(curl -sS https://api.monday.com/v2/file \
    -H "Authorization: $MONDAY_API_TOKEN" \
    -H "API-Version: 2024-01" \
    -F "query=$QUERY" \
    -F "variables={\"file\":null}" \
    -F "map={\"image\":[\"variables.file\"]}" \
    -F "image=@$FILE")
  if echo "$RESP" | grep -q "errors"; then
    echo "[$i/$count] $NAME — ERROR: $RESP"
  else
    echo "[$i/$count] $NAME — uploaded"
  fi
done < "$TMP_DIR/roster.tsv"

echo "done."
