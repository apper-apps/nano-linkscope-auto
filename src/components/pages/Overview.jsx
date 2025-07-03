import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MetricCard from '@/components/molecules/MetricCard'
import DataTable from '@/components/molecules/DataTable'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Chart from 'react-apexcharts'
import { domainService } from '@/services/api/domainService'
import { toast } from 'react-toastify'

const Overview = () => {
  const [domains, setDomains] = useState([])
  const [currentDomain, setCurrentDomain] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    loadDomains()
  }, [])

  const loadDomains = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await domainService.getAll()
      setDomains(data)
      if (data.length > 0) {
        setCurrentDomain(data[0])
      }
    } catch (err) {
      setError('Failed to load domains')
      toast.error('Failed to load domains')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (domain) => {
    try {
      setSearching(true)
      setError('')
      const domainData = await domainService.analyzeDomain(domain)
      setCurrentDomain(domainData)
      toast.success(`Analysis complete for ${domain}`)
    } catch (err) {
      setError('Failed to analyze domain')
      toast.error('Failed to analyze domain')
    } finally {
      setSearching(false)
    }
  }

  const trafficChartOptions = {
    chart: {
      type: 'area',
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
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    colors: ['#2dd4bf'],
    grid: { borderColor: '#f1f5f9' }
  }

  const trafficChartSeries = [{
    name: 'Organic Traffic',
    data: [12500, 15200, 18300, 22100, 25800, 28900]
  }]

  const topPagesColumns = [
    { key: 'page', label: 'Page', sortable: true },
    { key: 'traffic', label: 'Traffic', sortable: true },
    { key: 'keywords', label: 'Keywords', sortable: true },
    { key: 'backlinks', label: 'Backlinks', sortable: true }
  ]

  const topPagesData = [
    { page: '/blog/seo-guide', traffic: '5,240', keywords: '145', backlinks: '89' },
    { page: '/products/analytics', traffic: '3,890', keywords: '98', backlinks: '67' },
    { page: '/about', traffic: '2,156', keywords: '45', backlinks: '123' },
    { page: '/contact', traffic: '1,789', keywords: '23', backlinks: '56' },
    { page: '/pricing', traffic: '1,234', keywords: '34', backlinks: '78' }
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

  if (error && !currentDomain) {
    return <Error message={error} onRetry={loadDomains} />
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
          Analyze Website
        </h2>
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Enter domain name (e.g., example.com)"
        />
      </motion.div>

      {currentDomain ? (
        <>
          {/* Metrics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            <MetricCard
              title="Domain Rating"
              value={currentDomain.domainRating}
              change="+2.5%"
              trend="up"
              icon="Award"
            />
            <MetricCard
              title="Total Backlinks"
              value={currentDomain.backlinks?.toLocaleString() || '0'}
              change="+12.3%"
              trend="up"
              icon="Link"
            />
            <MetricCard
              title="Referring Domains"
              value={currentDomain.referringDomains?.toLocaleString() || '0'}
              change="+5.7%"
              trend="up"
              icon="Globe"
            />
            <MetricCard
              title="Organic Keywords"
              value={currentDomain.organicKeywords?.toLocaleString() || '0'}
              change="+8.9%"
              trend="up"
              icon="Search"
            />
          </motion.div>

          {/* Traffic Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-6">
              Organic Traffic Trend
            </h3>
            <Chart
              options={trafficChartOptions}
              series={trafficChartSeries}
              type="area"
              height={300}
            />
          </motion.div>

          {/* Top Pages Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-6">
              Top Performing Pages
            </h3>
            <DataTable
              columns={topPagesColumns}
              data={topPagesData}
              loading={searching}
            />
          </motion.div>
        </>
      ) : (
        <Empty
          type="default"
          title="No Domain Analyzed"
          description="Enter a domain name above to start analyzing its SEO performance and get detailed insights."
          icon="Search"
          actionLabel="Get Started"
          onAction={() => document.querySelector('input').focus()}
        />
      )}
    </div>
  )
}

export default Overview