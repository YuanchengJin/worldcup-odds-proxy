export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const TOKEN = 'cb0d1f2b-d225-453a-9328-42df773011be'

  try {
    // 第一步：先拿世界杯赛事（tournamentId=8 是世界杯）
    const { fixture_id } = req.query

    let url
    if (fixture_id) {
      // 拿单场完整赔率（含亚盘）
      url = `https://api.oddspapi.io/v4/odds?apiKey=${TOKEN}&fixtureId=${fixture_id}`
    } else {
      // 拿世界杯赛事列表
      url = `https://api.oddspapi.io/v4/fixtures?apiKey=${TOKEN}&tournamentId=8&hasOdds=true`
    }

    const r = await fetch(url, { headers: { 'Accept': 'application/json' } })
    const data = await r.json()
    res.status(200).json(data)
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
