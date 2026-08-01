import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN is not set. Connect a Blob store to this project and redeploy.' });
      return;
    }

    const { plan, dataUrl } = req.body ?? {};
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
      res.status(400).json({ error: 'Missing or invalid dataUrl' });
      return;
    }

    const match = dataUrl.match(/^data:(.+);base64,(.*)$/);
    if (!match) {
      res.status(400).json({ error: 'Malformed data URL' });
      return;
    }
    const [, contentType, base64] = match;
    const buffer = Buffer.from(base64, 'base64');
    const ext = contentType.split('/')[1] || 'png';

    const blob = await put(`payment-screenshots/${plan || 'unknown'}-${Date.now()}.${ext}`, buffer, {
      access: 'public',
      contentType,
    });

    res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error('Blob upload failed:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown upload error' });
  }
}
