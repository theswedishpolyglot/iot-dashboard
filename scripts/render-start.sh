#!/usr/bin/env sh
set -eu

DATA_DIR="${NODE_RED_DATA_DIR:-/data}"
PORT="${PORT:-1880}"
FLOW_FILE="flows.json"

echo "Starting Node-RED on port $PORT"

mkdir -p "$DATA_DIR"

if [ ! -f "$DATA_DIR/flows.json" ]; then
  cp /app/default-data/flows.json "$DATA_DIR/flows.json"
fi

if [ ! -f "$DATA_DIR/package.json" ]; then
  cp /app/default-data/package.json "$DATA_DIR/package.json"
fi

chown -R node-red:node-red "$DATA_DIR"

cd "$DATA_DIR"
su node-red -c "npm install --omit=dev --no-audit --no-fund"

if [ -n "${DATABASE_URL:-}" ]; then
  eval "$(
    node <<'JS'
const url = new URL(process.env.DATABASE_URL);

function quote(value) {
  return `'${String(value).replace(/'/g, "'\\''")}'`;
}

console.log(`export PGHOST=${quote(url.hostname)}`);
console.log(`export PGPORT=${quote(url.port || '5432')}`);
console.log(`export PGUSER=${quote(decodeURIComponent(url.username))}`);
console.log(`export PGPASSWORD=${quote(decodeURIComponent(url.password))}`);
console.log(`export PGDATABASE=${quote(decodeURIComponent(url.pathname.slice(1)))}`);
JS
  )"

  su node-red -c "node /app/scripts/prepare-render-flow.mjs '$DATA_DIR/flows.json' '$DATA_DIR/flows.render.json'"
  FLOW_FILE="flows.render.json"
fi

if [ -f /app/default-data/render-settings.js ]; then
  exec su node-red -c "node-red --settings /app/default-data/render-settings.js --userDir '$DATA_DIR' --flowFile '$FLOW_FILE' --port '$PORT'"
fi

exec su node-red -c "node-red --userDir '$DATA_DIR' --flowFile '$FLOW_FILE' --port '$PORT'"
