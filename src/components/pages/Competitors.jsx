import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DataTable from '@/components/molecules/DataTable'
import MetricCard from '@/components/molecules/MetricCard'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Chart from 'react-apexcharts'
import ApperIcon from '@/components/ApperIcon'
import { competitorService } from '@/services/api/competitorService'
import { toast } from 'react-toastify'

const Competitors = () => {
  const [competitors, setCompetitors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addCompetitor = async (domain) => {
    try {
      setLoading(true)
      setError('')
      const competitorData = await competitorService.analyze(domain)
      setCompetitors(prev => [...prev, competitorData])
      toast.success(`Added ${domain} as competitor`)
    } catch (err) {
      setError('Failed to add competitor')
      toast.error('Failed to add competitor')
    } finally {
      setLoading(false)
    }
  }

  const removeCompetitor = (domain) => {
    setCompetitors(prev => prev.filter(comp => comp.domain !== domain))
    toast.info(`Removed ${domain} from competitors`)
  }

  const competitorColumns = [
    { 
      key: 'domain', 
      label: 'Domain', 
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
        <span className="font-semibold text-gray-900">{value}</span>
      )
    },
    { 
      key: 'backlinks', 
      label: 'Backlinks', 
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900">{value?.toLocaleString() || 0}</span>
      )
    },
    { 
      key: 'organicKeywords', 
      label: 'Organic Keywords', 
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900">{value?.toLocaleString() || 0}</span>
      )
    },
    { 
      key: 'organicTraffic', 
      label: 'Organic Traffic', 
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900">{value?.toLocaleString() || 0}</span>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      sortable: false,
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="small"
            onClick={() => toast.info(`Viewing details for ${row.domain}`)}
          >
            <ApperIcon name="Eye" size={16} className="mr-1" />
            View
          </Button>
          <Button 
            variant="ghost" 
            size="small"
            onClick={() => removeCompetitor(row.domain)}
          >
            <ApperIcon name="Trash2" size={16} className="mr-1" />
            Remove
          </Button>
        </div>
      )
    }
  ]

  const comparisonChartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: competitors.map(comp => comp.domain),
      labels: { style: { colors: '#6B7280' } }
    },
    yaxis: {
      labels: { style: { colors: '#6B7280' } }
    },
    colors: ['#1e3a5f', '#2dd4bf', '#f59e0b'],
    grid: { borderColor: '#f1f5f9' },
    legend: { position: 'top' }
  }

  const comparisonChartSeries = [
    {
      name: 'Domain Rating',
      data: competitors.map(comp => comp.domainRating)
    },
    {
      name: 'Backlinks (K)',
      data: competitors.map(comp => Math.round((comp.backlinks || 0) / 1000))
    },
    {
      name: 'Keywords (K)',
      data: competitors.map(comp => Math.round((comp.organicKeywords || 0) / 1000))
    }
  ]

  if (loading && competitors.length === 0) {
    return <Loading type="cards" />
  }

  if (error && competitors.length === 0) {
    return <Error message={error} onRetry={() => setError('')} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Competitor Analysis
        </h1>
        <p className="text-gray-600">
          Analyze competitor SEO strategies and identify opportunities
        </p>
      </motion.div>

      {/* Add Competitor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
          Add Competitor
        </h2>
        <SearchBar
          onSearch={addCompetitor}
          placeholder="Enter competitor domain (e.g., competitor.com)"
          buttonText="Add Competitor"
        />
      </motion.div>

      {competitors.length > 0 ? (
        <>
          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            <MetricCard
              title="Competitors Tracked"
              value={competitors.length}
              icon="Users"
              trend="up"
            />
            <MetricCard
              title="Highest Domain Rating"
              value={Math.max(...competitors.map(comp => comp.domainRating))}
              icon="Award"
              trend="neutral"
            />
            <MetricCard
              title="Total Competitor Keywords"
              value={competitors.reduce((sum, comp) => sum + (comp.organicKeywords || 0), 0).toLocaleString()}
              icon="Search"
              trend="up"
            />
            <MetricCard
              title="Avg. Competitor Traffic"
              value={Math.round(competitors.reduce((sum, comp) => sum + (comp.organicTraffic || 0), 0) / competitors.length).toLocaleString()}
              icon="TrendingUp"
              trend="up"
            />
          </motion.div>

          {/* Comparison Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-6">
              Competitor Comparison
            </h3>
            <Chart
              options={comparisonChartOptions}
              series={comparisonChartSeries}
              type="bar"
              height={300}
            />
          </motion.div>

          {/* Competitors Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-semibold text-gray-900">
                Competitor Details
              </h3>
              <Button variant="outline">
                <ApperIcon name="Download" size={16} className="mr-2" />
                Export Analysis
              </Button>
            </div>
            
            <DataTable
              columns={competitorColumns}
              data={competitors}
              loading={loading}
            />
          </motion.div>
        </>
      ) : (
        <Empty type="competitors" onAction={() => document.querySelector('input').focus()} />
      )}
    </div>
  )
}

export default Competitors