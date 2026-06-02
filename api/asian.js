export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const TOKEN = 'cb0d1f2b-d225-453a-9328-42df773011be'
  const { event_id } = req.query

  try {
    // 先拉世界杯赛事列表
    const url = event_id
      ? `https://api.oddspapi.io/odds?apiKey=${TOKEN}&sport=soccer&bookmakers=singbet,pinnacle&markets=asian_handicap&eventId=${event_id}`
      : `https://api.oddspapi.io/sports/soccer/events?apiKey=${TOKEN}&league=FIFA World Cup`
    const r = await fetch(url, { headers: { 'Accept': 'application/json' } })
    const data = await r.json()
    res.status(200).json(data)
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
