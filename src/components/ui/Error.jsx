import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry, type = "default" }) => {
  const getErrorIcon = () => {
    switch (type) {
      case 'network':
        return 'WifiOff'
      case 'notFound':
        return 'Search'
      case 'server':
        return 'Server'
      default:
        return 'AlertCircle'
    }
  }

  const getErrorMessage = () => {
    switch (type) {
      case 'network':
        return "Unable to connect to the server. Please check your internet connection."
      case 'notFound':
        return "The data you're looking for couldn't be found."
      case 'server':
        return "Server is temporarily unavailable. Please try again later."
      default:
        return message
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <ApperIcon name={getErrorIcon()} size={32} className="text-white" />
      </div>
      
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {getErrorMessage()}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-gradient-primary hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default Error