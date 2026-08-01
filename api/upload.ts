import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
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
}
