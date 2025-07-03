import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-gradient-primary text-white hover:shadow-lg hover:shadow-primary/25 focus:ring-primary/20',
    secondary: 'bg-gradient-secondary text-white hover:shadow-lg hover:shadow-secondary/25 focus:ring-secondary/20',
    accent: 'bg-gradient-accent text-white hover:shadow-lg hover:shadow-accent/25 focus:ring-accent/20',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/20',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:ring-gray-200',
    danger: 'bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:shadow-error/25 focus:ring-error/20'
  }
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  }
  
  const disabledStyles = 'opacity-50 cursor-not-allowed'
  
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? disabledStyles : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button