export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const TOKEN = 'b66054388c77eb9d8e089b1b3792f08236e8bbb3'
  const { event_id } = req.query
  if (!event_id) return res.status(400).json({ error: 'event_id required' })
  try {
    const r = await fetch(
      `https://sports.bzzoiro.com/api/odds/compare/?event=${event_id}`,
      { headers: { 'Authorization': `Token ${TOKEN}` } }
    )
    const data = await r.json()
    res.status(200).json(data)
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
