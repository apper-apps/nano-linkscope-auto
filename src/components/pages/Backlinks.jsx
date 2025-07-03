import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DataTable from '@/components/molecules/DataTable'
import FilterPanel from '@/components/molecules/FilterPanel'
import MetricCard from '@/components/molecules/MetricCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Badge from '@/components/atoms/Badge'
import Chart from 'react-apexcharts'
import { backlinkService } from '@/services/api/backlinkService'
import { toast } from 'react-toastify'

const Backlinks = () => {
  const [backlinks, setBacklinks] = useState([])
  const [filteredBacklinks, setFilteredBacklinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadBacklinks()
  }, [])

  const loadBacklinks = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await backlinkService.getAll()
      setBacklinks(data)
      setFilteredBacklinks(data)
    } catch (err) {
      setError('Failed to load backlinks')
      toast.error('Failed to load backlinks')
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (filters) => {
    let filtered = [...backlinks]
    
    if (filters.doFollow !== '') {
      filtered = filtered.filter(link => 
        filters.doFollow === 'true' ? link.doFollow : !link.doFollow
      )
    }
    
    if (filters.minDomainRating) {
      filtered = filtered.filter(link => 
        link.domainRating >= parseInt(filters.minDomainRating)
      )
    }
    
    if (filters.anchorText) {
      filtered = filtered.filter(link => 
        link.anchorText.toLowerCase().includes(filters.anchorText.toLowerCase())
      )
    }
    
    setFilteredBacklinks(filtered)
  }

  const backlinkColumns = [
    { 
      key: 'sourceUrl', 
      label: 'Source URL', 
      sortable: true,
      render: (value) => (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-secondary hover:text-secondary/80 hover:underline"
        >
          {value.length > 50 ? `${value.substring(0, 50)}...` : value}
        </a>
      )
    },
    { 
      key: 'anchorText', 
      label: 'Anchor Text', 
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    { 
      key: 'domainRating', 
      label: 'Domain Rating', 
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <span className="font-semibold text-gray-900 mr-2">{value}</span>
          <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-secondary rounded-full"
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      )
    },
    { 
      key: 'doFollow', 
      label: 'Link Type', 
      sortable: true,
      render: (value) => (
        <Badge variant={value ? 'success' : 'warning'}>
          {value ? 'DoFollow' : 'NoFollow'}
        </Badge>
      )
    },
    { 
      key: 'firstSeen', 
      label: 'First Seen', 
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    }
  ]

  const filterOptions = [
    {
      key: 'doFollow',
      label: 'Link Type',
      type: 'select',
      options: [
        { value: '', label: 'All Types' },
        { value: 'true', label: 'DoFollow' },
        { value: 'false', label: 'NoFollow' }
      ]
    },
    {
      key: 'minDomainRating',
      label: 'Minimum Domain Rating',
      type: 'number',
      placeholder: 'e.g., 50'
    },
    {
      key: 'anchorText',
      label: 'Anchor Text',
      type: 'text',
      placeholder: 'Search anchor text...'
    }
  ]

  const newLinksChartOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      labels: { style: { colors: '#6B7280' } }
    },
    yaxis: {
      labels: { style: { colors: '#6B7280' } }
    },
    colors: ['#10b981', '#ef4444'],
    grid: { borderColor: '#f1f5f9' },
    legend: { position: 'top' }
  }

  const newLinksChartSeries = [
    {
      name: 'New Links',
      data: [45, 52, 38, 65, 49, 58]
    },
    {
      name: 'Lost Links',
      data: [12, 18, 25, 15, 22, 19]
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="cards" />
        <Loading type="chart" />
        <Loading type="table" />
      </div>
    )
  }

  if (error) {
    return <Error message={error} onRetry={loadBacklinks} />
  }

  if (backlinks.length === 0) {
    return <Empty type="backlinks" onAction={loadBacklinks} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Backlink Analysis
        </h1>
        <p className="text-gray-600">
          Monitor your website's backlink profile and discover new opportunities
        </p>
      </motion.div>

      {/* Metrics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Total Backlinks"
          value={backlinks.length.toLocaleString()}
          change="+12.3%"
          trend="up"
          icon="Link"
        />
        <MetricCard
          title="DoFollow Links"
          value={backlinks.filter(link => link.doFollow).length.toLocaleString()}
          change="+8.7%"
          trend="up"
          icon="ExternalLink"
        />
        <MetricCard
          title="Referring Domains"
          value={new Set(backlinks.map(link => new URL(link.sourceUrl).hostname)).size.toLocaleString()}
          change="+5.2%"
          trend="up"
          icon="Globe"
        />
        <MetricCard
          title="Avg Domain Rating"
          value={Math.round(backlinks.reduce((sum, link) => sum + link.domainRating, 0) / backlinks.length)}
          change="+2.1%"
          trend="up"
          icon="Award"
        />
      </motion.div>

      {/* New/Lost Links Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-xl font-display font-semibold text-gray-900 mb-6">
          New & Lost Links
        </h3>
        <Chart
          options={newLinksChartOptions}
          series={newLinksChartSeries}
          type="line"
          height={300}
        />
      </motion.div>

      {/* Filter Panel and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <FilterPanel
            filters={filterOptions}
            onFilterChange={handleFilter}
            onReset={() => setFilteredBacklinks(backlinks)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3"
        >
          <DataTable
            columns={backlinkColumns}
            data={filteredBacklinks}
            loading={loading}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default Backlinks