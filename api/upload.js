const { put } = require('@vercel/blob');
const Busboy = require('busboy');

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: req.headers });
    const fileChunks = [];
    let filename = 'upload';
    let mimeType = 'application/octet-stream';

    busboy.on('file', (fieldname, file, info) => {
      filename = info.filename || filename;
      mimeType = info.mimeType || mimeType;
      file.on('data', (data) => fileChunks.push(data));
    });
    busboy.on('finish', () => {
      resolve({ buffer: Buffer.concat(fileChunks), filename, mimeType });
    });
    busboy.on('error', reject);
    req.pipe(busboy);
  });
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
    return;
  }

  const password = req.headers['x-admin-password'];
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const { buffer, filename, mimeType } = await parseForm(req);
    if (!buffer || !buffer.length) {
      res.status(400).json({ error: 'No file data received by the server.' });
      return;
    }
    const blob = await put(`uploads/${Date.now()}-${filename}`, buffer, {
      access: 'public',
      contentType: mimeType,
      addRandomSuffix: true,
    });
    res.status(200).json({ url: blob.url });
  } catch (err) {
    res.status(500).json({ error: String((err && err.message) || err) });
  }
}

// Multipart form data must not be pre-parsed by the platform.
handler.config = { api: { bodyParser: false } };

module.exports = handler;
