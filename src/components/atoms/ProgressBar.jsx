import { motion } from 'framer-motion'

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  variant = 'primary',
  size = 'medium',
  showLabel = false,
  className = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  const variants = {
    primary: 'from-primary to-blue-600',
    secondary: 'from-secondary to-teal-600',
    success: 'from-success to-green-600',
    warning: 'from-warning to-orange-600',
    error: 'from-error to-red-600',
    info: 'from-info to-blue-600'
  }
  
  const sizes = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
  }
  
  const getVariantFromValue = (val) => {
    if (val >= 80) return 'error'
    if (val >= 60) return 'warning'
    if (val >= 40) return 'info'
    return 'success'
  }
  
  const finalVariant = variant === 'auto' ? getVariantFromValue(percentage) : variant
  
  return (
    <div className={`w-full ${className}`}>
      <div className={`bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${variants[finalVariant]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-sm text-gray-600 text-center">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  )
}

export default ProgressBar