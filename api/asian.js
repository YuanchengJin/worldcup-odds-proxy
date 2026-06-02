export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const TOKEN = 'cb0d1f2b-d225-453a-9328-42df773011be'
  const { mode, tid, fid } = req.query

  const { mode, tid, fid } = req.query

  if (!TOKEN) {
    return res.status(500).json({
      error: 'Missing ODDSPAPI_KEY',
      message: '请在 Vercel Environment Variables 里设置 ODDSPAPI_KEY'
    })
  }

  try {
    let url

    if (mode === 'tournaments') {
      // 搜索含 world cup 的联赛
      url = `https://api.oddspapi.io/v4/tournaments?apiKey=${TOKEN}&sportId=10&name=world`

    } else if (mode === 'fixtures' && tid) {
      // 拿某联赛的赛事
      url = `https://api.oddspapi.io/v4/fixtures?apiKey=${TOKEN}&tournamentId=${tid}&hasOdds=true`

    } else if (mode === 'odds' && fid) {
      // 拿单场全部赔率
      url = `https://api.oddspapi.io/v4/odds?apiKey=${TOKEN}&fixtureId=${fid}`

    } else if (mode === 'marketids' && fid) {
      // 调试：列出这场比赛所有盘口 ID
      url = `https://api.oddspapi.io/v4/odds?apiKey=${TOKEN}&fixtureId=${fid}`

      const r = await fetch(url, {
        headers: {
          Accept: 'application/json'
        }
      })

      const data = await r.json()

      if (data.error) {
        return res.status(400).json({
          message: 'Oddspapi 返回错误',
          apiError: data.error
        })
      }

      const result = []

      for (const [bookmakerName, bookmakerData] of Object.entries(data.bookmakerOdds || {})) {
        const markets = bookmakerData.markets || {}

        for (const [marketId, marketData] of Object.entries(markets)) {
          result.push({
            bookmaker: bookmakerName,
            marketId,
            bookmakerMarketId: marketData.bookmakerMarketId,
            marketActive: marketData.marketActive,
            outcomeIds: Object.keys(marketData.outcomes || {}),
            mainLine: hasMainLine(marketData)
          })
        }
      }

      return res.status(200).json(result)

    } else if (mode === 'asian' && fid) {
      // 真正筛选亚盘：这里先需要你知道哪个 marketId 是 Asian Handicap
      url = `https://api.oddspapi.io/v4/odds?apiKey=${TOKEN}&fixtureId=${fid}`

      const r = await fetch(url, {
        headers: {
          Accept: 'application/json'
        }
      })

      const data = await r.json()

      if (data.error) {
        return res.status(400).json({
          message: 'Oddspapi 返回错误',
          apiError: data.error
        })
      }

      // 这里先留空，等你确认 Asian Handicap 的 marketId 后填进去
      // 例如：const ASIAN_MARKET_IDS = ['xxxx', 'yyyy']
      const ASIAN_MARKET_IDS = []

      const asianOdds = []

      for (const [bookmakerName, bookmakerData] of Object.entries(data.bookmakerOdds || {})) {
        const markets = bookmakerData.markets || {}

        for (const [marketId, marketData] of Object.entries(markets)) {
          if (!ASIAN_MARKET_IDS.includes(marketId)) {
            continue
          }

          asianOdds.push({
            bookmaker: bookmakerName,
            marketId,
            bookmakerMarketId: marketData.bookmakerMarketId,
            marketActive: marketData.marketActive,
            outcomes: extractOutcomes(marketData)
          })
        }
      }

      return res.status(200).json({
        fixtureId: data.fixtureId,
        participant1Name: data.participant1Name,
        participant2Name: data.participant2Name,
        asianOdds
      })

    } else {
      // 默认：搜联赛
      url = `https://api.oddspapi.io/v4/tournaments?apiKey=${TOKEN}&sportId=10&name=world`
    }

    const r = await fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    })

    const data = await r.json()

    return res.status(200).json(data)

  } catch (e) {
    return res.status(500).json({
      error: e.message
    })
  }
}

function hasMainLine(marketData) {
  const outcomes = marketData.outcomes || {}

  for (const outcome of Object.values(outcomes)) {
    const players = outcome.players || {}

    for (const player of Object.values(players)) {
      if (player.mainLine === true) {
        return true
      }
    }
  }

  return false
}

function extractOutcomes(marketData) {
  const result = []
  const outcomes = marketData.outcomes || {}

  for (const [outcomeId, outcomeData] of Object.entries(outcomes)) {
    const players = outcomeData.players || {}

    for (const [playerId, playerData] of Object.entries(players)) {
      result.push({
        outcomeId,
        playerId,
        active: playerData.active,
        price: playerData.price,
        priceAmerican: playerData.priceAmerican,
        priceFractional: playerData.priceFractional,
        mainLine: playerData.mainLine,
        limit: playerData.limit,
        changedAt: playerData.changedAt
      })
    }
  }

  return result
}
