import mockKeywords from '@/services/mockData/keywords.json'

export const keywordService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockKeywords
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockKeywords.find(keyword => keyword.Id === parseInt(id))
  },

  async research(seedKeyword) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate related keywords based on seed keyword
    const relatedKeywords = [
      `${seedKeyword} guide`,
      `${seedKeyword} tips`,
      `${seedKeyword} strategy`,
      `${seedKeyword} tools`,
      `${seedKeyword} tutorial`,
      `best ${seedKeyword}`,
      `${seedKeyword} for beginners`,
      `${seedKeyword} checklist`,
      `${seedKeyword} examples`,
      `${seedKeyword} course`
    ]

    const suggestions = relatedKeywords.map((keyword, index) => ({
      Id: Date.now() + index,
      keyword: keyword,
      searchVolume: Math.floor(Math.random() * 10000) + 100,
      difficulty: Math.floor(Math.random() * 100) + 1,
      cpc: Math.random() * 10 + 0.5,
      position: Math.floor(Math.random() * 100) + 1,
      url: `https://example.com/${keyword.replace(/\s+/g, '-')}`,
      traffic: Math.floor(Math.random() * 1000) + 50
    }))

    return suggestions
  },

  async create(keyword) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const maxId = Math.max(...mockKeywords.map(k => k.Id), 0)
    const newKeyword = {
      Id: maxId + 1,
      ...keyword
    }
    mockKeywords.push(newKeyword)
    return newKeyword
  },

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockKeywords.findIndex(keyword => keyword.Id === parseInt(id))
    if (index !== -1) {
      mockKeywords[index] = { ...mockKeywords[index], ...data }
      return mockKeywords[index]
    }
    throw new Error('Keyword not found')
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = mockKeywords.findIndex(keyword => keyword.Id === parseInt(id))
    if (index !== -1) {
      mockKeywords.splice(index, 1)
      return true
    }
    throw new Error('Keyword not found')
  }
}