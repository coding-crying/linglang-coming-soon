import { mkdir, appendFile } from 'node:fs/promises';
import path from 'node:path';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function readBody(request) {
  if (request.body && typeof request.body === 'object') return request.body;

  if (typeof request.body === 'string') {
    const rawBody = request.body.trim();
    if (!rawBody) return {};

    try {
      return JSON.parse(rawBody);
    } catch {
      return Object.fromEntries(new URLSearchParams(rawBody));
    }
  }

  return await new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        resolve(Object.fromEntries(new URLSearchParams(body)));
      }
    });
    request.on('error', reject);
  });
}

function cleanText(value, fallback = '') {
  return String(value || fallback)
    .replace(/[^\w./:-]/g, '-')
    .slice(0, 120);
}

async function storeWithSupabase(record) {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.WAITLIST_TABLE || 'waitlist_signups';

  if (!supabaseUrl || !serviceKey) return false;

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      email: record.email,
      source: record.source,
      page: record.page,
      created_at: record.createdAt,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Supabase waitlist write failed. ${detail}`.trim());
  }

  return true;
}

async function storeWithWebhook(record) {
  const webhookUrl = process.env.WAITLIST_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const headers = { 'Content-Type': 'application/json' };
  if (process.env.WAITLIST_WEBHOOK_SECRET) {
    headers.Authorization = `Bearer ${process.env.WAITLIST_WEBHOOK_SECRET}`;
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    throw new Error('Waitlist webhook write failed.');
  }

  return true;
}

async function storeLocally(record) {
  if (process.env.VERCEL) return false;

  const dataDir = path.join(process.cwd(), '.data');
  await mkdir(dataDir, { recursive: true });
  await appendFile(
    path.join(dataDir, 'waitlist-signups.jsonl'),
    `${JSON.stringify(record)}\n`,
    'utf8',
  );

  return true;
}

export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  try {
    const body = await readBody(request);
    const email = String(body.email || '').trim().toLowerCase();

    if (!emailPattern.test(email)) {
      response.status(400).json({ error: 'Enter a valid email.' });
      return;
    }

    const record = {
      email,
      source: cleanText(body.source, 'site'),
      page: cleanText(body.page, '/'),
      createdAt: new Date().toISOString(),
      userAgent: String(request.headers['user-agent'] || '').slice(0, 240),
      referer: String(request.headers.referer || '').slice(0, 240),
    };

    const stored =
      (await storeWithSupabase(record)) ||
      (await storeWithWebhook(record)) ||
      (await storeLocally(record));

    if (!stored) {
      response.status(503).json({
        error: 'Email storage is not configured yet.',
      });
      return;
    }

    response.status(200).json({ ok: true });
  } catch (error) {
    response.status(500).json({
      error: error instanceof Error ? error.message : 'Could not save this email.',
    });
  }
}
