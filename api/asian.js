export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const TOKEN = process.env.ODDSPAPI_KEY
  const { mode, tid, fid } = req.query

  try {
    let url

    if (mode === 'tournaments') {
      url = `https://api.oddspapi.io/v4/tournaments?apiKey=${TOKEN}&sportId=10&name=world`
    } else if (mode === 'fixtures' && tid) {
      url = `https://api.oddspapi.io/v4/fixtures?apiKey=${TOKEN}&tournamentId=${tid}&hasOdds=true`
    } else if (mode === 'odds' && fid) {
      url = `https://api.oddspapi.io/v4/odds?apiKey=${TOKEN}&fixtureId=${fid}`
    } else {
      url = `https://api.oddspapi.io/v4/tournaments?apiKey=${TOKEN}&sportId=10&name=world`
    }

    const r = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    })

    const data = await r.json()

    if (mode === 'odds') {
      const text = JSON.stringify(data).toLowerCase()

      if (!text.includes('asian') && !text.includes('handicap')) {
        return res.status(200).json({
          message: '这场比赛暂时没有找到 Asian Handicap / 亚盘字段',
          raw: data
        })
      }

      return res.status(200).json(data)
    }

    res.status(200).json(data)
  } catch (e) {
    res.status(500).json({
      error: e.message
    })
  }
}
