import fs from 'node:fs';

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  throw new Error('Usage: node prepare-render-flow.mjs <input> <output>');
}

const flow = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const postgresConfig = {
  id: 'postgres_db',
  type: 'postgreSQLConfig',
  name: 'Render Postgres',
  host: 'PGHOST',
  hostFieldType: 'env',
  port: 'PGPORT',
  portFieldType: 'env',
  database: 'PGDATABASE',
  databaseFieldType: 'env',
  ssl: 'false',
  sslFieldType: 'bool',
  max: '10',
  maxFieldType: 'num',
  idle: '1000',
  idleFieldType: 'num',
  connectionTimeout: '10000',
  connectionTimeoutFieldType: 'num',
  user: 'PGUSER',
  userFieldType: 'env',
  password: 'PGPASSWORD',
  passwordFieldType: 'env'
};

const postgresNodeIds = new Set([
  'sqlite_create',
  'sqlite_insert',
  'sqlite_history'
]);

const sqliteHistoryQuery =
  "SELECT value, device_timestamp, received_at FROM readings WHERE device_timestamp >= strftime('%s','now','-30 minutes') ORDER BY device_timestamp ASC;";

const postgresHistoryQuery =
  "SELECT value, device_timestamp, received_at FROM readings WHERE device_timestamp >= EXTRACT(EPOCH FROM NOW() - INTERVAL '30 minutes') ORDER BY device_timestamp ASC;";

const transformed = flow
  .filter((node) => node.id !== 'sqlite_db')
  .map((node) => {
    if (node.id === 'inject_create_table') {
      return {
        ...node,
        topic: [
          'CREATE TABLE IF NOT EXISTS readings (',
          'id SERIAL PRIMARY KEY,',
          'value DOUBLE PRECISION NOT NULL,',
          'device_timestamp BIGINT,',
          'received_at TIMESTAMPTZ NOT NULL',
          ');'
        ].join(' ')
      };
    }

    if (node.id === 'inject_history' && node.topic === sqliteHistoryQuery) {
      return {
        ...node,
        topic: postgresHistoryQuery
      };
    }

    if (node.id === 'trigger_refresh_history') {
      return {
        ...node,
        rules: node.rules.map((rule) => (
          rule.to === sqliteHistoryQuery ? { ...rule, to: postgresHistoryQuery } : rule
        ))
      };
    }

    if (postgresNodeIds.has(node.id)) {
      return {
        id: node.id,
        type: 'postgresql',
        z: node.z,
        name: node.name,
        query: '{{{ msg.topic }}}',
        postgreSQLConfig: 'postgres_db',
        split: false,
        rowsPerMsg: '1',
        outputs: 1,
        x: node.x,
        y: node.y,
        wires: node.wires
      };
    }

    return node;
  });

transformed.push(postgresConfig);

fs.writeFileSync(outputPath, `${JSON.stringify(transformed, null, 2)}\n`);
