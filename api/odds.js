export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const TOKEN = 'b66054388c77eb9d8e089b1b3792f08236e8bbb3'
  
  try {
    // 拉取世界杯赛程+赔率
    const response = await fetch(
      'https://sports.bzzoiro.com/api/events/?competition_ids=1&token=' + TOKEN,
      { headers: { 'Accept': 'application/json' } }
    )
    const data = await response.json()
    res.status(200).json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
