export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  const matchId = req.query.matchId
  if (!matchId) {
    return res.status(400).json({ error: 'matchId required' })
  }

  try {
    const url = `https://odds.500.com/fenxi1/json/yazhi.php?fid=${matchId}&r=1&type=yazhi`
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://odds.500.com/',
        'Accept': 'application/json, text/javascript, */*'
      }
    })
    const text = await response.text()
    res.status(200).send(text)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
