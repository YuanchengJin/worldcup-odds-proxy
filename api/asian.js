export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const TOKEN = 'cb0d1f2b-d225-453a-9328-42df773011be'
  const { mode, tid, fid } = req.query

  try {
    let url
    if (mode === 'tournaments') {
      // 搜索含 world cup 的联赛
      url = `https://api.oddspapi.io/v4/tournaments?apiKey=${TOKEN}&sportId=10&name=world`
    } else if (mode === 'fixtures' && tid) {
      // 拿某联赛的赛事
      url = `https://api.oddspapi.io/v4/fixtures?apiKey=${TOKEN}&tournamentId=${tid}&hasOdds=true`
    } else if (mode === 'odds' && fid) {
      // 拿单场赔率
      url = `https://api.oddspapi.io/v4/odds?apiKey=${TOKEN}&fixtureId=${fid}`
    } else {
      // 默认：搜联赛
      url = `https://api.oddspapi.io/v4/tournaments?apiKey=${TOKEN}&sportId=10&name=world`
    }

    const r = await fetch(url, { headers: { 'Accept': 'application/json' } })
    const data = await r.json()
    res.status(200).json(data)
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
