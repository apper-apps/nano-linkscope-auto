import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DataTable from '@/components/molecules/DataTable'
import MetricCard from '@/components/molecules/MetricCard'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Badge from '@/components/atoms/Badge'
import ProgressBar from '@/components/atoms/ProgressBar'
import Button from '@/components/atoms/Button'
import Chart from 'react-apexcharts'
import ApperIcon from '@/components/ApperIcon'
import { auditService } from '@/services/api/auditService'
import { toast } from 'react-toastify'

const SiteAudit = () => {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [auditComplete, setAuditComplete] = useState(false)

  const runAudit = async (domain) => {
    try {
      setLoading(true)
      setError('')
      setAuditComplete(false)
      const auditResults = await auditService.runAudit(domain)
      setIssues(auditResults)
      setAuditComplete(true)
      toast.success(`Audit completed for ${domain}`)
    } catch (err) {
      setError('Failed to run site audit')
      toast.error('Failed to run site audit')
    } finally {
      setLoading(false)
    }
  }

  const issueColumns = [
    { 
      key: 'type', 
      label: 'Issue Type', 
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    { 
      key: 'severity', 
      label: 'Severity', 
      sortable: true,
      render: (value) => (
        <Badge variant={value === 'critical' ? 'critical' : value === 'warning' ? 'warning' : 'notice'}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    { 
      key: 'affectedPages', 
      label: 'Affected Pages', 
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900">{value?.toLocaleString() || 0}</span>
      )
    },
    { 
      key: 'description', 
      label: 'Description', 
      sortable: false,
      render: (value) => (
        <span className="text-gray-700">{value.length > 80 ? `${value.substring(0, 80)}...` : value}</span>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      sortable: false,
      render: (_, row) => (
        <Button 
          variant="ghost" 
          size="small"
          onClick={() => toast.info(`Viewing details for: ${row.type}`)}
        >
          <ApperIcon name="Eye" size={16} className="mr-1" />
          View Details
        </Button>
      )
    }
  ]

  const healthScoreChartOptions = {
    chart: {
      type: 'radialBar',
      toolbar: { show: false }
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '60%'
        },
        dataLabels: {
          name: {
            fontSize: '16px',
            color: '#374151'
          },
          value: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937'
          }
        }
      }
    },
    colors: ['#10b981'],
    labels: ['Health Score']
  }

  const getHealthScore = () => {
    if (issues.length === 0) return 100
    const criticalIssues = issues.filter(issue => issue.severity === 'critical').length
    const warningIssues = issues.filter(issue => issue.severity === 'warning').length
    const noticeIssues = issues.filter(issue => issue.severity === 'notice').length
    
    const score = Math.max(0, 100 - (criticalIssues * 20 + warningIssues * 10 + noticeIssues * 5))
    return Math.round(score)
  }

  const healthScoreData = [getHealthScore()]

  const getCriticalIssues = () => issues.filter(issue => issue.severity === 'critical')
  const getWarningIssues = () => issues.filter(issue => issue.severity === 'warning')
  const getNoticeIssues = () => issues.filter(issue => issue.severity === 'notice')

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <motion.div
                className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
                Running Site Audit
              </h3>
              <p className="text-gray-600">
                Analyzing your website for SEO issues...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
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
          Site Audit
        </h1>
        <p className="text-gray-600">
          Identify and fix technical SEO issues to improve your website's performance
        </p>
      </motion.div>

      {/* Audit Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
          Run Site Audit
        </h2>
        <SearchBar
          onSearch={runAudit}
          placeholder="Enter domain to audit (e.g., example.com)"
          buttonText="Start Audit"
        />
      </motion.div>

      {auditComplete && (
        <>
          {/* Health Score and Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="text-xl font-display font-semibold text-gray-900 mb-6">
                Overall Health Score
              </h3>
              <Chart
                options={healthScoreChartOptions}
                series={healthScoreData}
                type="radialBar"
                height={250}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 gap-4"
            >
              <MetricCard
                title="Critical Issues"
                value={getCriticalIssues().length}
                icon="AlertTriangle"
                trend={getCriticalIssues().length > 0 ? "down" : "neutral"}
                className="bg-gradient-to-br from-red-50 to-red-100 border-red-200"
              />
              <MetricCard
                title="Warning Issues"
                value={getWarningIssues().length}
                icon="AlertCircle"
                trend={getWarningIssues().length > 0 ? "down" : "neutral"}
                className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200"
              />
              <MetricCard
                title="Notice Issues"
                value={getNoticeIssues().length}
                icon="Info"
                trend="neutral"
                className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
              />
            </motion.div>
          </div>

          {/* Issues Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-semibold text-gray-900">
                Detailed Issues
              </h3>
              <Button variant="outline">
                <ApperIcon name="Download" size={16} className="mr-2" />
                Export Report
              </Button>
            </div>
            
            {issues.length > 0 ? (
              <DataTable
                columns={issueColumns}
                data={issues}
                loading={loading}
              />
            ) : (
              <Empty type="issues" onAction={() => document.querySelector('input').focus()} />
            )}
          </motion.div>
        </>
      )}

      {!auditComplete && !loading && (
        <Empty
          title="No Audit Results"
          description="Enter a domain name above to start a comprehensive SEO audit and identify improvement opportunities."
          icon="ShieldCheck"
          actionLabel="Start Audit"
          onAction={() => document.querySelector('input').focus()}
        />
      )}
    </div>
  )
}

export default SiteAudit