import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data found",
  description = "Get started by adding some data",
  icon = "Database",
  actionLabel = "Get Started",
  onAction,
  type = "default"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'backlinks':
        return {
          title: "No backlinks found",
          description: "Start building your backlink profile by creating high-quality content and reaching out to relevant websites.",
          icon: "Link",
          actionLabel: "Learn Link Building"
        }
      case 'keywords':
        return {
          title: "No keywords tracked",
          description: "Add keywords to start tracking your search engine rankings and discover new opportunities.",
          icon: "Search",
          actionLabel: "Add Keywords"
        }
      case 'issues':
        return {
          title: "No issues found",
          description: "Great! Your website appears to be in good health. Keep monitoring for any new issues.",
          icon: "CheckCircle",
          actionLabel: "Run Another Audit"
        }
      case 'competitors':
        return {
          title: "No competitors added",
          description: "Add competitor domains to analyze their SEO strategies and identify opportunities.",
          icon: "Users",
          actionLabel: "Add Competitors"
        }
      default:
        return { title, description, icon, actionLabel }
    }
  }

  const content = getEmptyContent()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center mb-6 shadow-lg">
        <ApperIcon name={content.icon} size={40} className="text-white" />
      </div>
      
      <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
        {content.title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed text-lg">
        {content.description}
      </p>
      
      {onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-secondary hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-8 py-3"
        >
          <ApperIcon name="Plus" size={18} className="mr-2" />
          {content.actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty