export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const TOKEN = 'b66054388c77eb9d8e089b1b3792f08236e8bbb3'
  const { date, event_id } = req.query

  try {
    let url
    if (event_id) {
      // 获取单场赔率
      url = `https://sports.bzzoiro.com/api/v2/events/${event_id}/odds/`
    } else {
      // 获取某天的赛事列表（含基础赔率）
      const today = date || new Date().toISOString().slice(0, 10)
      url = `https://sports.bzzoiro.com/api/v2/events/?date_from=${today}&date_to=${today}&limit=200`
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Token ${TOKEN}`,
        'Accept': 'application/json'
      }
    })
    const data = await response.json()
    res.status(200).json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
