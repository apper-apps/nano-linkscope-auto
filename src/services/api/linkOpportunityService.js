import mockData from '@/services/mockData/linkOpportunities.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Track last used ID for new opportunities
let lastId = Math.max(...mockData.map(item => item.Id), 0)

// Create a working copy of the data
let opportunities = [...mockData]

export const linkOpportunityService = {
  async getAll() {
    await delay(200)
    return [...opportunities]
  },

  async getById(id) {
    await delay(200)
    
    // Validate ID is integer
    const numId = parseInt(id)
    if (isNaN(numId)) {
      throw new Error('Invalid ID: must be an integer')
    }
    
    const opportunity = opportunities.find(item => item.Id === numId)
    if (!opportunity) {
      throw new Error(`Link opportunity with ID ${numId} not found`)
    }
    
    return { ...opportunity }
  },

  async create(opportunityData) {
    await delay(200)
    
    // Auto-generate integer ID
    const newId = ++lastId
    
    const newOpportunity = {
      Id: newId,
      website: opportunityData.website || '',
      type: opportunityData.type || 'broken-link',
      targetUrl: opportunityData.targetUrl || '',
      anchorText: opportunityData.anchorText || '',
      domainRating: opportunityData.domainRating || 0,
      status: 'new',
      foundAt: new Date().toISOString(),
      contactedAt: null,
      acquiredAt: null,
      notes: opportunityData.notes || ''
    }
    
    opportunities.push(newOpportunity)
    return { ...newOpportunity }
  },

  async update(id, opportunityData) {
    await delay(200)
    
    // Validate ID is integer
    const numId = parseInt(id)
    if (isNaN(numId)) {
      throw new Error('Invalid ID: must be an integer')
    }
    
    const index = opportunities.findIndex(item => item.Id === numId)
    if (index === -1) {
      throw new Error(`Link opportunity with ID ${numId} not found`)
    }
    
    // Prevent ID changes
    const updatedOpportunity = {
      ...opportunities[index],
      ...opportunityData,
      Id: numId // Ensure ID cannot be changed
    }
    
    opportunities[index] = updatedOpportunity
    return { ...updatedOpportunity }
  },

  async delete(id) {
    await delay(200)
    
    // Validate ID is integer
    const numId = parseInt(id)
    if (isNaN(numId)) {
      throw new Error('Invalid ID: must be an integer')
    }
    
    const index = opportunities.findIndex(item => item.Id === numId)
    if (index === -1) {
      throw new Error(`Link opportunity with ID ${numId} not found`)
    }
    
    opportunities.splice(index, 1)
    return true
  },

  async getByStatus(status) {
    await delay(200)
    return opportunities.filter(item => item.status === status)
  },

  async getByType(type) {
    await delay(200)
    return opportunities.filter(item => item.type === type)
  },

  async getByDomainRating(minRating, maxRating) {
    await delay(200)
    return opportunities.filter(item => {
      const rating = item.domainRating
      return rating >= minRating && (maxRating ? rating <= maxRating : true)
    })
  }
}