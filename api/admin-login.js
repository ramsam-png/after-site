module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
    return;
  }
  const { password } = req.body || {};
  if (process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ ok: false });
  }
};
