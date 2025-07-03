import { motion } from 'framer-motion'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'medium',
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-gradient-to-r from-primary to-blue-600 text-white',
    secondary: 'bg-gradient-to-r from-secondary to-teal-600 text-white',
    success: 'bg-gradient-to-r from-success to-green-600 text-white',
    warning: 'bg-gradient-to-r from-warning to-orange-600 text-white',
    error: 'bg-gradient-to-r from-error to-red-600 text-white',
    info: 'bg-gradient-to-r from-info to-blue-600 text-white',
    critical: 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg',
    notice: 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
  }
  
  const sizes = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1.5 text-sm',
    large: 'px-4 py-2 text-base'
  }
  
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.span>
  )
}

export default Badge