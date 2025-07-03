import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend = 'neutral',
  className = ''
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success'
      case 'down':
        return 'text-error'
      default:
        return 'text-gray-500'
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return 'TrendingUp'
      case 'down':
        return 'TrendingDown'
      default:
        return 'Minus'
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`
        bg-white rounded-2xl p-6 shadow-lg border border-gray-100 
        hover:shadow-xl transition-all duration-200
        ${className}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gradient-secondary rounded-xl">
          <ApperIcon name={icon} size={24} className="text-white" />
        </div>
        {change && (
          <div className={`flex items-center ${getTrendColor()}`}>
            <ApperIcon name={getTrendIcon()} size={16} className="mr-1" />
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
      
      <h3 className="text-3xl font-display font-bold text-gray-900 mb-1">
        {value}
      </h3>
      
      <p className="text-gray-600 font-medium">{title}</p>
    </motion.div>
  )
}

export default MetricCard