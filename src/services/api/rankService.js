export const rankService = {
  async addKeyword(keyword) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Simulate rank tracking data
    const rankData = {
      Id: Date.now(),
      keyword: keyword,
      currentPosition: Math.floor(Math.random() * 100) + 1,
      previousPosition: Math.floor(Math.random() * 100) + 1,
      searchVolume: Math.floor(Math.random() * 10000) + 100,
      url: `https://example.com/${keyword.replace(/\s+/g, '-')}`,
      lastChecked: new Date().toISOString(),
      history: [
        { date: '2024-01-01', position: Math.floor(Math.random() * 100) + 1 },
        { date: '2024-01-07', position: Math.floor(Math.random() * 100) + 1 },
        { date: '2024-01-14', position: Math.floor(Math.random() * 100) + 1 },
        { date: '2024-01-21', position: Math.floor(Math.random() * 100) + 1 },
        { date: '2024-01-28', position: Math.floor(Math.random() * 100) + 1 }
      ]
    }
    
    return rankData
  },

  async getKeywordHistory(keyword) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Simulate historical ranking data
    const history = []
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 6)
    
    for (let i = 0; i < 26; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + (i * 7))
      
      history.push({
        date: date.toISOString().split('T')[0],
        position: Math.floor(Math.random() * 100) + 1,
        url: `https://example.com/${keyword.replace(/\s+/g, '-')}`
      })
    }
    
    return history
  },

  async updateRankings() {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simulate bulk ranking update
    return {
      updated: Math.floor(Math.random() * 50) + 10,
      improved: Math.floor(Math.random() * 20) + 5,
      declined: Math.floor(Math.random() * 15) + 3,
      unchanged: Math.floor(Math.random() * 15) + 2
    }
  }
}