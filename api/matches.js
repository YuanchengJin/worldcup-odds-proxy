export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const TOKEN = 'b66054388c77eb9d8e089b1b3792f08236e8bbb3'
  const { date } = req.query
  const today = date || new Date().toISOString().slice(0, 10)

  try {
    const response = await fetch(
      `https://sports.bzzoiro.com/api/v2/events/?date_from=${today}&date_to=${today}&limit=200`,
      { headers: { 'Authorization': `Token ${TOKEN}`, 'Accept': 'application/json' } }
    )
    const data = await response.json()
    const simplified = data.results.map(e => ({
      id: e.id,
      home: e.home_team,
      away: e.away_team,
      date: e.event_date,
      league_id: e.league_id
    }))
    res.status(200).json({ date: today, count: simplified.length, matches: simplified })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
