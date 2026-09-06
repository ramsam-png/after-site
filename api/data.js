const { put, list } = require('@vercel/blob');

const DATA_PATH = 'data/site-data.json';

async function readData() {
  const { blobs } = await list({ prefix: DATA_PATH, limit: 1 });
  const match = blobs.find((b) => b.pathname === DATA_PATH);
  if (!match) return null;
  const res = await fetch(match.url, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const data = await readData();
    res.status(200).json(data || {});
    return;
  }

  if (req.method === 'POST') {
    const password = req.headers['x-admin-password'];
    if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const { categories, products, reviews } = req.body || {};
    await put(DATA_PATH, JSON.stringify({ categories, products, reviews }), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    res.status(200).json({ ok: true });
    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end('Method Not Allowed');
};
