import { AccessToken } from 'livekit-server-sdk';

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

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    response.status(500).json({ error: 'LiveKit credentials are not configured.' });
    return;
  }

  const identity = String(request.body?.identity || '').slice(0, 80);
  const roomName = String(request.body?.roomName || '').slice(0, 120);

  if (!identity || !roomName) {
    response.status(400).json({ error: 'Missing identity or roomName.' });
    return;
  }

  const token = new AccessToken(apiKey, apiSecret, {
    identity,
    ttl: '10m',
  });

  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  response.status(200).json({ token: await token.toJwt() });
}
