import mockDomains from '@/services/mockData/domains.json'

export const domainService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockDomains
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockDomains.find(domain => domain.Id === parseInt(id))
  },

  async analyzeDomain(url) {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simulate domain analysis
    const mockAnalysis = {
      Id: Date.now(),
      url: url,
      domainRating: Math.floor(Math.random() * 100) + 1,
      backlinks: Math.floor(Math.random() * 50000) + 1000,
      referringDomains: Math.floor(Math.random() * 5000) + 100,
      organicKeywords: Math.floor(Math.random() * 10000) + 500,
      organicTraffic: Math.floor(Math.random() * 100000) + 5000,
      lastUpdated: new Date().toISOString()
    }
    
    return mockAnalysis
  },

  async create(domain) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const maxId = Math.max(...mockDomains.map(d => d.Id), 0)
    const newDomain = {
      Id: maxId + 1,
      ...domain,
      lastUpdated: new Date().toISOString()
    }
    mockDomains.push(newDomain)
    return newDomain
  },

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockDomains.findIndex(domain => domain.Id === parseInt(id))
    if (index !== -1) {
      mockDomains[index] = { ...mockDomains[index], ...data, lastUpdated: new Date().toISOString() }
      return mockDomains[index]
    }
    throw new Error('Domain not found')
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = mockDomains.findIndex(domain => domain.Id === parseInt(id))
    if (index !== -1) {
      mockDomains.splice(index, 1)
      return true
    }
    throw new Error('Domain not found')
  }
}