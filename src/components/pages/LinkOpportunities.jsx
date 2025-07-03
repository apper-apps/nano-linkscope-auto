import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DataTable from '@/components/molecules/DataTable'
import SearchBar from '@/components/molecules/SearchBar'
import FilterPanel from '@/components/molecules/FilterPanel'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { linkOpportunityService } from '@/services/api/linkOpportunityService'
import { toast } from 'react-toastify'

const LinkOpportunities = () => {
  const [opportunities, setOpportunities] = useState([])
  const [filteredOpportunities, setFilteredOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState({
    type: '',
    status: '',
    domainRating: ''
  })

  useEffect(() => {
    loadOpportunities()
  }, [])

  useEffect(() => {
    filterOpportunities()
  }, [opportunities, searchTerm, activeFilters])

  const loadOpportunities = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await linkOpportunityService.getAll()
      setOpportunities(data)
    } catch (err) {
      setError('Failed to load link opportunities')
      toast.error('Failed to load link opportunities')
    } finally {
      setLoading(false)
    }
  }

  const filterOpportunities = () => {
    let filtered = [...opportunities]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.targetUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.anchorText.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Type filter
    if (activeFilters.type) {
      filtered = filtered.filter(item => item.type === activeFilters.type)
    }

    // Status filter
    if (activeFilters.status) {
      filtered = filtered.filter(item => item.status === activeFilters.status)
    }

    // Domain Rating filter
    if (activeFilters.domainRating) {
      const [min, max] = activeFilters.domainRating.split('-').map(Number)
      filtered = filtered.filter(item => {
        const dr = item.domainRating
        return max ? dr >= min && dr <= max : dr >= min
      })
    }

    setFilteredOpportunities(filtered)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleFilterChange = (filters) => {
    setActiveFilters(filters)
  }

  const handleContactWebsite = async (opportunity) => {
    try {
      await linkOpportunityService.update(opportunity.Id, {
        ...opportunity,
        status: 'contacted',
        contactedAt: new Date().toISOString()
      })
      
      setOpportunities(prev => 
        prev.map(item => 
          item.Id === opportunity.Id 
            ? { ...item, status: 'contacted', contactedAt: new Date().toISOString() }
            : item
        )
      )
      
      toast.success('Website contacted successfully')
    } catch (err) {
      toast.error('Failed to update opportunity status')
    }
  }

  const handleMarkAsAcquired = async (opportunity) => {
    try {
      await linkOpportunityService.update(opportunity.Id, {
        ...opportunity,
        status: 'acquired',
        acquiredAt: new Date().toISOString()
      })
      
      setOpportunities(prev => 
        prev.map(item => 
          item.Id === opportunity.Id 
            ? { ...item, status: 'acquired', acquiredAt: new Date().toISOString() }
            : item
        )
      )
      
      toast.success('Opportunity marked as acquired')
    } catch (err) {
      toast.error('Failed to update opportunity status')
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'new': { variant: 'info', label: 'New' },
      'contacted': { variant: 'warning', label: 'Contacted' },
      'acquired': { variant: 'success', label: 'Acquired' },
      'rejected': { variant: 'error', label: 'Rejected' }
    }
    
    const config = statusConfig[status] || { variant: 'info', label: 'Unknown' }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getTypeBadge = (type) => {
    const typeConfig = {
      'broken-link': { variant: 'error', label: 'Broken Link' },
      'unlinked-mention': { variant: 'warning', label: 'Unlinked Mention' }
    }
    
    const config = typeConfig[type] || { variant: 'info', label: 'Unknown' }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const columns = [
    { 
      key: 'website', 
      label: 'Website', 
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <ApperIcon name="Globe" size={16} className="text-gray-400" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    { 
      key: 'type', 
      label: 'Type', 
      sortable: true,
      render: (value) => getTypeBadge(value)
    },
    { 
      key: 'targetUrl', 
      label: 'Target URL', 
      sortable: true,
      render: (value) => (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-secondary hover:underline truncate max-w-xs block"
        >
          {value}
        </a>
      )
    },
    { 
      key: 'anchorText', 
      label: 'Anchor Text', 
      sortable: true,
      render: (value) => (
        <span className="text-gray-600 italic">{value}</span>
      )
    },
    { 
      key: 'domainRating', 
      label: 'Domain Rating', 
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-1">
          <span className="font-medium">{value}</span>
          <ApperIcon name="TrendingUp" size={14} className="text-secondary" />
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          {row.status === 'new' && (
            <Button
              variant="outline"
              size="small"
              onClick={() => handleContactWebsite(row)}
            >
              <ApperIcon name="Mail" size={14} />
            </Button>
          )}
          {row.status === 'contacted' && (
            <Button
              variant="outline"
              size="small"
              onClick={() => handleMarkAsAcquired(row)}
            >
              <ApperIcon name="Check" size={14} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="small"
            onClick={() => window.open(row.targetUrl, '_blank')}
          >
            <ApperIcon name="ExternalLink" size={14} />
          </Button>
        </div>
      )
    }
  ]

  const filterOptions = [
    {
      key: 'type',
      label: 'Type',
      options: [
        { value: '', label: 'All Types' },
        { value: 'broken-link', label: 'Broken Links' },
        { value: 'unlinked-mention', label: 'Unlinked Mentions' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'new', label: 'New' },
        { value: 'contacted', label: 'Contacted' },
        { value: 'acquired', label: 'Acquired' },
        { value: 'rejected', label: 'Rejected' }
      ]
    },
    {
      key: 'domainRating',
      label: 'Domain Rating',
      options: [
        { value: '', label: 'All Ratings' },
        { value: '0-30', label: '0-30' },
        { value: '31-50', label: '31-50' },
        { value: '51-70', label: '51-70' },
        { value: '71-100', label: '71+' }
      ]
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="cards" />
        <Loading type="table" />
      </div>
    )
  }

  if (error && opportunities.length === 0) {
    return <Error message={error} onRetry={loadOpportunities} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              Link Opportunities
            </h1>
            <p className="text-gray-600 mt-1">
              Discover broken links and unlinked mentions to build quality backlinks
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {filteredOpportunities.length} opportunities found
            </div>
            <Button onClick={loadOpportunities} variant="outline">
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <SearchBar
          onSearch={handleSearch}
          placeholder="Search websites, URLs, or anchor text..."
          value={searchTerm}
        />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <FilterPanel
          filters={filterOptions}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />
      </motion.div>

      {/* Opportunities Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredOpportunities.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredOpportunities}
            loading={loading}
          />
        ) : (
          <Empty
            type="default"
            title="No Link Opportunities Found"
            description="Try adjusting your search criteria or filters to find more opportunities."
            icon="Search"
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchTerm('')
              setActiveFilters({ type: '', status: '', domainRating: '' })
            }}
          />
        )}
      </motion.div>
    </div>
  )
}

export default LinkOpportunities