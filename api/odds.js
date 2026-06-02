export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  try {
    const url = 'https://odds.500.com/index_zqdc.shtml'
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://odds.500.com/',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    })
    const html = await response.text()

    // 提取 yapanList（亚盘）
    const yapanMatch = html.match(/var yapanList=(\{.*?\});/)
    // 提取 ouzhiList（欧赔，用于主胜/平/负赔率）
    const ouzhiMatch = html.match(/var ouzhiList=(\{.*?\});/)
    // 提取比赛列表（fid + 球队名）
    const matches = []
    const rowRegex = /data-fid="(\d+)"[^>]*>[\s\S]*?<a class="team_link"[^>]*>([^<]+)<\/a>[\s\S]*?VS[\s\S]*?<a class="team_link"[^>]*>([^<]+)<\/a>/g
    let m
    while ((m = rowRegex.exec(html)) !== null) {
      if (!matches.find(x => x.fid === m[1])) {
        matches.push({ fid: m[1], home: m[2], away: m[3] })
      }
    }

    if (!yapanMatch && !ouzhiMatch) {
      return res.status(200).json({ error: 'no data found', matches })
    }

    const yapan = yapanMatch ? JSON.parse(yapanMatch[1]) : {}
    const ouzhi = ouzhiMatch ? JSON.parse(ouzhiMatch[1]) : {}

    res.status(200).json({ yapan, ouzhi, matches })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
