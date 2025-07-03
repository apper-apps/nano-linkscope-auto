import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DataTable from '@/components/molecules/DataTable'
import FilterPanel from '@/components/molecules/FilterPanel'
import MetricCard from '@/components/molecules/MetricCard'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Badge from '@/components/atoms/Badge'
import ProgressBar from '@/components/atoms/ProgressBar'
import Chart from 'react-apexcharts'
import { keywordService } from '@/services/api/keywordService'
import { toast } from 'react-toastify'

const Keywords = () => {
  const [keywords, setKeywords] = useState([])
  const [filteredKeywords, setFilteredKeywords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadKeywords()
  }, [])

  const loadKeywords = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await keywordService.getAll()
      setKeywords(data)
      setFilteredKeywords(data)
    } catch (err) {
      setError('Failed to load keywords')
      toast.error('Failed to load keywords')
    } finally {
      setLoading(false)
    }
  }

  const handleKeywordResearch = async (keyword) => {
    try {
      const results = await keywordService.research(keyword)
      setKeywords(prev => [...prev, ...results])
      setFilteredKeywords(prev => [...prev, ...results])
      toast.success(`Found ${results.length} keyword suggestions`)
    } catch (err) {
      toast.error('Failed to research keywords')
    }
  }

  const handleFilter = (filters) => {
    let filtered = [...keywords]
    
    if (filters.minSearchVolume) {
      filtered = filtered.filter(keyword => 
        keyword.searchVolume >= parseInt(filters.minSearchVolume)
      )
    }
    
    if (filters.maxDifficulty) {
      filtered = filtered.filter(keyword => 
        keyword.difficulty <= parseInt(filters.maxDifficulty)
      )
    }
    
    if (filters.position) {
      filtered = filtered.filter(keyword => 
        keyword.position <= parseInt(filters.position)
      )
    }
    
    setFilteredKeywords(filtered)
  }

  const keywordColumns = [
    { 
      key: 'keyword', 
      label: 'Keyword', 
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    { 
      key: 'searchVolume', 
      label: 'Search Volume', 
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900">{value?.toLocaleString() || 'N/A'}</span>
      )
    },
    { 
      key: 'difficulty', 
      label: 'Difficulty', 
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900 w-8">{value}</span>
          <ProgressBar value={value} variant="auto" size="small" className="flex-1" />
        </div>
      )
    },
    { 
      key: 'position', 
      label: 'Position', 
      sortable: true,
      render: (value) => (
        <Badge variant={value <= 3 ? 'success' : value <= 10 ? 'warning' : 'error'}>
          #{value}
        </Badge>
      )
    },
    { 
      key: 'cpc', 
      label: 'CPC', 
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">${value?.toFixed(2) || '0.00'}</span>
      )
    },
    { 
      key: 'traffic', 
      label: 'Traffic', 
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900">{value?.toLocaleString() || '0'}</span>
      )
    }
  ]

  const filterOptions = [
    {
      key: 'minSearchVolume',
      label: 'Min Search Volume',
      type: 'number',
      placeholder: 'e.g., 1000'
    },
    {
      key: 'maxDifficulty',
      label: 'Max Difficulty',
      type: 'number',
      placeholder: 'e.g., 50'
    },
    {
      key: 'position',
      label: 'Max Position',
      type: 'number',
      placeholder: 'e.g., 10'
    }
  ]

  const difficultyChartOptions = {
    chart: {
      type: 'donut',
      toolbar: { show: false }
    },
    labels: ['Easy (0-30)', 'Medium (31-70)', 'Hard (71-100)'],
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    legend: { position: 'bottom' },
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    }
  }

  const difficultyData = [
    keywords.filter(k => k.difficulty <= 30).length,
    keywords.filter(k => k.difficulty > 30 && k.difficulty <= 70).length,
    keywords.filter(k => k.difficulty > 70).length
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
    return <Error message={error} onRetry={loadKeywords} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Keyword Research
        </h1>
        <p className="text-gray-600">
          Discover high-value keywords and track your search rankings
        </p>
      </motion.div>

      {/* Keyword Research Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
          Keyword Research
        </h2>
        <SearchBar
          onSearch={handleKeywordResearch}
          placeholder="Enter seed keyword (e.g., 'digital marketing')"
          buttonText="Research"
        />
      </motion.div>

      {keywords.length > 0 ? (
        <>
          {/* Metrics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            <MetricCard
              title="Total Keywords"
              value={keywords.length.toLocaleString()}
              change="+15.2%"
              trend="up"
              icon="Search"
            />
            <MetricCard
              title="Top 10 Rankings"
              value={keywords.filter(k => k.position <= 10).length.toLocaleString()}
              change="+8.3%"
              trend="up"
              icon="TrendingUp"
            />
            <MetricCard
              title="Total Search Volume"
              value={keywords.reduce((sum, k) => sum + (k.searchVolume || 0), 0).toLocaleString()}
              change="+12.7%"
              trend="up"
              icon="BarChart3"
            />
            <MetricCard
              title="Avg. Difficulty"
              value={Math.round(keywords.reduce((sum, k) => sum + k.difficulty, 0) / keywords.length)}
              change="-2.1%"
              trend="down"
              icon="Target"
            />
          </motion.div>

          {/* Difficulty Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-6">
              Keyword Difficulty Distribution
            </h3>
            <Chart
              options={difficultyChartOptions}
              series={difficultyData}
              type="donut"
              height={300}
            />
          </motion.div>

          {/* Filter Panel and Table */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-1"
            >
              <FilterPanel
                filters={filterOptions}
                onFilterChange={handleFilter}
                onReset={() => setFilteredKeywords(keywords)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-3"
            >
              <DataTable
                columns={keywordColumns}
                data={filteredKeywords}
                loading={loading}
              />
            </motion.div>
          </div>
        </>
      ) : (
        <Empty type="keywords" onAction={() => document.querySelector('input').focus()} />
      )}
    </div>
  )
}

export default Keywords