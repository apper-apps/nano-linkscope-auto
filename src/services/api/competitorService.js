export const competitorService = {
  async analyze(domain) {
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    // Simulate competitor analysis
    const competitorData = {
      Id: Date.now(),
      domain: domain,
      domainRating: Math.floor(Math.random() * 100) + 1,
      backlinks: Math.floor(Math.random() * 100000) + 5000,
      referringDomains: Math.floor(Math.random() * 10000) + 500,
      organicKeywords: Math.floor(Math.random() * 50000) + 2000,
      organicTraffic: Math.floor(Math.random() * 500000) + 10000,
      lastUpdated: new Date().toISOString()
    }
    
    return competitorData
  },

  async compare(domains) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Simulate comparison data
    const comparison = domains.map(domain => ({
      domain: domain,
      domainRating: Math.floor(Math.random() * 100) + 1,
      backlinks: Math.floor(Math.random() * 100000) + 5000,
      organicKeywords: Math.floor(Math.random() * 50000) + 2000,
      organicTraffic: Math.floor(Math.random() * 500000) + 10000,
      topKeywords: [
        `${domain} reviews`,
        `${domain} pricing`,
        `${domain} features`,
        `${domain} alternatives`
      ]
    }))
    
    return comparison
  },

  async getSharedKeywords(domain1, domain2) {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Simulate shared keywords
    const sharedKeywords = [
      {
        keyword: 'digital marketing',
        domain1Position: Math.floor(Math.random() * 50) + 1,
        domain2Position: Math.floor(Math.random() * 50) + 1,
        searchVolume: Math.floor(Math.random() * 10000) + 1000,
        difficulty: Math.floor(Math.random() * 100) + 1
      },
      {
        keyword: 'SEO tools',
        domain1Position: Math.floor(Math.random() * 50) + 1,
        domain2Position: Math.floor(Math.random() * 50) + 1,
        searchVolume: Math.floor(Math.random() * 10000) + 1000,
        difficulty: Math.floor(Math.random() * 100) + 1
      },
      {
        keyword: 'content marketing',
        domain1Position: Math.floor(Math.random() * 50) + 1,
        domain2Position: Math.floor(Math.random() * 50) + 1,
        searchVolume: Math.floor(Math.random() * 10000) + 1000,
        difficulty: Math.floor(Math.random() * 100) + 1
      }
    ]
    
    return sharedKeywords
  }
}