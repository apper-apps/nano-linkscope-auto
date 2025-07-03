import mockAuditIssues from '@/services/mockData/auditIssues.json'

export const auditService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockAuditIssues
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockAuditIssues.find(issue => issue.Id === parseInt(id))
  },

  async runAudit(domain) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate audit results
    const auditResults = [
      {
        Id: 1,
        type: 'Missing Meta Descriptions',
        severity: 'critical',
        affectedPages: Math.floor(Math.random() * 50) + 10,
        description: 'Many pages are missing meta descriptions, which are important for SEO.',
        solution: 'Add unique meta descriptions to all pages, keeping them between 150-160 characters.'
      },
      {
        Id: 2,
        type: 'Broken Internal Links',
        severity: 'warning',
        affectedPages: Math.floor(Math.random() * 20) + 5,
        description: 'Found internal links pointing to non-existent pages.',
        solution: 'Update or remove broken internal links to improve user experience.'
      },
      {
        Id: 3,
        type: 'Large Image Files',
        severity: 'warning',
        affectedPages: Math.floor(Math.random() * 30) + 15,
        description: 'Some images are too large and may slow down page loading.',
        solution: 'Optimize images by compressing them and using appropriate formats.'
      },
      {
        Id: 4,
        type: 'Missing Alt Text',
        severity: 'notice',
        affectedPages: Math.floor(Math.random() * 40) + 20,
        description: 'Images without alt text affect accessibility and SEO.',
        solution: 'Add descriptive alt text to all images for better accessibility.'
      },
      {
        Id: 5,
        type: 'Slow Page Speed',
        severity: 'critical',
        affectedPages: Math.floor(Math.random() * 25) + 8,
        description: 'Page loading times are above recommended thresholds.',
        solution: 'Optimize CSS, JavaScript, and images to improve page speed.'
      }
    ]

    return auditResults
  },

  async create(issue) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const maxId = Math.max(...mockAuditIssues.map(i => i.Id), 0)
    const newIssue = {
      Id: maxId + 1,
      ...issue
    }
    mockAuditIssues.push(newIssue)
    return newIssue
  },

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockAuditIssues.findIndex(issue => issue.Id === parseInt(id))
    if (index !== -1) {
      mockAuditIssues[index] = { ...mockAuditIssues[index], ...data }
      return mockAuditIssues[index]
    }
    throw new Error('Audit issue not found')
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = mockAuditIssues.findIndex(issue => issue.Id === parseInt(id))
    if (index !== -1) {
      mockAuditIssues.splice(index, 1)
      return true
    }
    throw new Error('Audit issue not found')
  }
}