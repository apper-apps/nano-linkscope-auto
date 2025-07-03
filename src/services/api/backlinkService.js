import mockBacklinks from '@/services/mockData/backlinks.json'

export const backlinkService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockBacklinks
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockBacklinks.find(backlink => backlink.Id === parseInt(id))
  },

  async getByDomain(domain) {
    await new Promise(resolve => setTimeout(resolve, 400))
    return mockBacklinks.filter(backlink => 
      backlink.targetUrl.includes(domain) || backlink.sourceUrl.includes(domain)
    )
  },

  async create(backlink) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const maxId = Math.max(...mockBacklinks.map(b => b.Id), 0)
    const newBacklink = {
      Id: maxId + 1,
      ...backlink,
      firstSeen: new Date().toISOString(),
      lastChecked: new Date().toISOString()
    }
    mockBacklinks.push(newBacklink)
    return newBacklink
  },

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockBacklinks.findIndex(backlink => backlink.Id === parseInt(id))
    if (index !== -1) {
      mockBacklinks[index] = { ...mockBacklinks[index], ...data, lastChecked: new Date().toISOString() }
      return mockBacklinks[index]
    }
    throw new Error('Backlink not found')
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = mockBacklinks.findIndex(backlink => backlink.Id === parseInt(id))
    if (index !== -1) {
      mockBacklinks.splice(index, 1)
      return true
    }
    throw new Error('Backlink not found')
  }
}