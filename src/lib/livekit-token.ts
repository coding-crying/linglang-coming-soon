export async function getLiveKitToken(identity: string, roomName: string): Promise<string> {
  const response = await fetch('/api/livekit-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity, roomName }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Token request failed: ${response.status}`);
  }

  const data = await response.json();
  if (!data.token) {
    throw new Error('Token response did not include a token.');
  }

  return data.token;
}
