#!/usr/bin/env bash
# Push role / LinkedIn / bio from src/data/teamRoster.ts into the new
# columns on monday board 1879224155.
#
#   Role     -> text_mm3bxhyd
#   LinkedIn -> link_mm3bvtmk
#   Bio      -> long_text_mm3bdjkb
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
set -a
# shellcheck disable=SC1091
source .env.local
set +a

[[ -n "${MONDAY_API_TOKEN:-}" ]] || { echo "MONDAY_API_TOKEN missing"; exit 1; }

BOARD_ID=1879224155
ROLE_COL=text_mm3bxhyd
LINKEDIN_COL=link_mm3bvtmk
BIO_COL=long_text_mm3bdjkb

# Stream JSON lines: {id, name, role, linkedinUrl?, bio?}
node --input-type=module -e '
import fs from "node:fs";
const src = fs.readFileSync("src/data/teamRoster.ts", "utf8");
const arrMatch = src.match(/TEAM_ROSTER:[^=]*=\s*\[(.*)\n\]/s);
if (!arrMatch) { console.error("array not found"); process.exit(1); }
const body = arrMatch[1];
// Split top-level entries by curly-brace depth.
let depth = 0, cur = "";
const entries = [];
for (const ch of body) {
  cur += ch;
  if (ch === "{") depth++;
  else if (ch === "}") {
    depth--;
    if (depth === 0) { entries.push(cur); cur = ""; }
  }
}
const get = (e, key) => {
  const m = e.match(new RegExp(`\\b${key}:\\s*"((?:\\\\.|[^"\\\\])*)"`));
  return m ? m[1].replace(/\\"/g, "\"").replace(/\\\\/g, "\\") : null;
};
for (const e of entries) {
  const id = get(e, "id");
  if (!id || !/^\d+$/.test(id)) continue;
  const out = {
    id,
    name: get(e, "name"),
    role: get(e, "role"),
    linkedinUrl: get(e, "linkedinUrl"),
    bio: get(e, "bio"),
  };
  process.stdout.write(JSON.stringify(out) + "\n");
}
' > /tmp/roster_lines.jsonl

count=$(wc -l < /tmp/roster_lines.jsonl | tr -d " ")
echo "Pushing roles/links/bios for $count items..."

i=0
while IFS= read -r line; do
  i=$((i+1))
  ID=$(echo "$line" | python3 -c "import sys,json; print(json.loads(sys.stdin.read())['id'])")
  NAME=$(echo "$line" | python3 -c "import sys,json; print(json.loads(sys.stdin.read())['name'])")
  COLVAL=$(python3 - <<PY
import json
d = json.loads('''$line''')
out = {}
if d.get('role'): out['$ROLE_COL'] = d['role']
if d.get('linkedinUrl'): out['$LINKEDIN_COL'] = {"url": d['linkedinUrl'], "text": "LinkedIn"}
if d.get('bio'): out['$BIO_COL'] = {"text": d['bio']}
print(json.dumps(out))
PY
)
  if [[ "$COLVAL" == "{}" ]]; then
    echo "[$i/$count] $NAME — nothing to push"
    continue
  fi

  ESCAPED_COLVAL=$(python3 -c "import json,sys; print(json.dumps(sys.stdin.read()))" <<<"$COLVAL")
  QUERY=$(cat <<GQL
mutation { change_multiple_column_values(board_id: $BOARD_ID, item_id: $ID, column_values: $ESCAPED_COLVAL) { id } }
GQL
)
  RESP=$(curl -sS https://api.monday.com/v2 \
    -H "Authorization: $MONDAY_API_TOKEN" \
    -H "API-Version: 2024-01" \
    -H "Content-Type: application/json" \
    -d "$(python3 -c "import json,sys; print(json.dumps({'query': sys.stdin.read()}))" <<<"$QUERY")")
  if echo "$RESP" | grep -q '"errors"'; then
    echo "[$i/$count] $NAME — ERROR: $RESP"
  else
    echo "[$i/$count] $NAME — updated"
  fi
done < /tmp/roster_lines.jsonl

echo done.
