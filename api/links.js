// Public — these are meant to be visible/clickable, not secret.
module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end('Method Not Allowed');
    return;
  }
  res.status(200).json({
    discord: process.env.DISCORD_URL || '',
    telegram: process.env.TELEGRAM_URL || '',
  });
};
