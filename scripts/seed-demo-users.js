/**
 * Creates demo accounts. Run once: node scripts/seed-demo-users.js
 * Requires SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL in .env.local
 */

const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const users = [
  { email: 'brand@collabnet.com', meta: { name: 'Brand Manager', role: 'brand', company_name: 'Acme Corp' } },
  { email: 'creator@collabnet.com', meta: { name: 'Sarah Creator', role: 'creator' } },
  { email: 'agency@collabnet.com', meta: { name: 'Agency Pro', role: 'agency', agency_name: 'Collab Agency' } },
  { email: 'admin@collabnet.com', meta: { name: 'Super Admin', role: 'admin' } },
];

async function main() {
  if (!url || !key) {
    console.error('Missing env vars in .env.local');
    process.exit(1);
  }

  for (const u of users) {
    const res = await fetch(`${url}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: u.email,
        password: 'password123',
        email_confirm: true,
        user_metadata: u.meta,
      }),
    });
    const data = await res.json();
    console.log(u.email, res.status, data.msg || data.email || 'ok');
  }
}

main();
