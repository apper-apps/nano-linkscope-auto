import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DataTable from '@/components/molecules/DataTable'
import MetricCard from '@/components/molecules/MetricCard'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import Chart from 'react-apexcharts'
import ApperIcon from '@/components/ApperIcon'
import { rankService } from '@/services/api/rankService'
import { toast } from 'react-toastify'

const RankTracker = () => {
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addKeyword = async (keyword) => {
    try {
      setLoading(true)
      setError('')
      const rankData = await rankService.addKeyword(keyword)
      setRankings(prev => [...prev, rankData])
      toast.success(`Added "${keyword}" to rank tracking`)
    } catch (err) {
      setError('Failed to add keyword')
      toast.error('Failed to add keyword')
    } finally {
      setLoading(false)
    }
  }

  const removeKeyword = (keyword) => {
    setRankings(prev => prev.filter(rank => rank.keyword !== keyword))
    toast.info(`Removed "${keyword}" from tracking`)
  }

  const rankColumns = [
    { 
      key: 'keyword', 
      label: 'Keyword', 
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    { 
      key: 'currentPosition', 
      label: 'Current Position', 
      sortable: true,
      render: (value) => (
        <Badge variant={value <= 3 ? 'success' : value <= 10 ? 'warning' : 'error'}>
          #{value}
        </Badge>
      )
    },
    { 
      key: 'previousPosition', 
      label: 'Previous Position', 
      sortable: true,
      render: (value) => (
        <span className="text-gray-600">#{value}</span>
      )
    },
    { 
      key: 'change', 
      label: 'Change', 
      sortable: true,
      render: (_, row) => {
        const change = row.previousPosition - row.currentPosition
        if (change === 0) return <span className="text-gray-500">-</span>
        return (
          <div className={`flex items-center ${change > 0 ? 'text-success' : 'text-error'}`}>
            <ApperIcon 
              name={change > 0 ? 'TrendingUp' : 'TrendingDown'} 
              size={16} 
              className="mr-1"
            />
            <span className="font-medium">{Math.abs(change)}</span>
          </div>
        )
      }
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
      key: 'url', 
      label: 'Ranking URL', 
      sortable: false,
      render: (value) => (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-secondary hover:text-secondary/80 hover:underline"
        >
          {value?.length > 40 ? `${value.substring(0, 40)}...` : value}
        </a>
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
            onClick={() => toast.info(`Viewing history for "${row.keyword}"`)}
          >
            <ApperIcon name="History" size={16} className="mr-1" />
            History
          </Button>
          <Button 
            variant="ghost" 
            size="small"
            onClick={() => removeKeyword(row.keyword)}
          >
            <ApperIcon name="Trash2" size={16} className="mr-1" />
            Remove
          </Button>
        </div>
      )
    }
  ]

  const rankingChartOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { 
      curve: 'smooth', 
      width: 3,
      colors: ['#1e3a5f', '#2dd4bf', '#f59e0b']
    },
    xaxis: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      labels: { style: { colors: '#6B7280' } }
    },
    yaxis: {
      reversed: true,
      min: 1,
      max: 100,
      labels: { 
        style: { colors: '#6B7280' },
        formatter: (val) => `#${val}`
      }
    },
    colors: ['#1e3a5f', '#2dd4bf', '#f59e0b'],
    grid: { borderColor: '#f1f5f9' },
    legend: { position: 'top' }
  }

  const rankingChartSeries = [
    {
      name: 'SEO tips',
      data: [15, 12, 8, 6, 4, 3]
    },
    {
      name: 'digital marketing',
      data: [45, 42, 38, 35, 32, 28]
    },
    {
      name: 'content strategy',
      data: [25, 23, 20, 18, 15, 12]
    }
  ]

  if (loading && rankings.length === 0) {
    return <Loading type="cards" />
  }

  if (error && rankings.length === 0) {
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
          Rank Tracker
        </h1>
        <p className="text-gray-600">
          Monitor your keyword rankings and track position changes over time
        </p>
      </motion.div>

      {/* Add Keyword */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
          Add Keyword to Track
        </h2>
        <SearchBar
          onSearch={addKeyword}
          placeholder="Enter keyword to track (e.g., 'best SEO tools')"
          buttonText="Track Keyword"
        />
      </motion.div>

      {rankings.length > 0 ? (
        <>
          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            <MetricCard
              title="Keywords Tracked"
              value={rankings.length}
              icon="Search"
              trend="up"
            />
            <MetricCard
              title="Top 3 Rankings"
              value={rankings.filter(rank => rank.currentPosition <= 3).length}
              icon="Trophy"
              trend="up"
            />
            <MetricCard
              title="Top 10 Rankings"
              value={rankings.filter(rank => rank.currentPosition <= 10).length}
              icon="Target"
              trend="up"
            />
            <MetricCard
              title="Avg. Position"
              value={Math.round(rankings.reduce((sum, rank) => sum + rank.currentPosition, 0) / rankings.length)}
              icon="TrendingUp"
              trend="up"
            />
          </motion.div>

          {/* Ranking Trends Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-6">
              Ranking Trends
            </h3>
            <Chart
              options={rankingChartOptions}
              series={rankingChartSeries}
              type="line"
              height={300}
            />
          </motion.div>

          {/* Rankings Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-semibold text-gray-900">
                Keyword Rankings
              </h3>
              <Button variant="outline">
                <ApperIcon name="Download" size={16} className="mr-2" />
                Export Rankings
              </Button>
            </div>
            
            <DataTable
              columns={rankColumns}
              data={rankings}
              loading={loading}
            />
          </motion.div>
        </>
      ) : (
        <Empty 
          title="No Keywords Tracked"
          description="Start tracking keywords to monitor your search engine rankings and identify opportunities for improvement."
          icon="TrendingUp"
          actionLabel="Track First Keyword"
          onAction={() => document.querySelector('input').focus()}
        />
      )}
    </div>
  )
}

export default RankTracker