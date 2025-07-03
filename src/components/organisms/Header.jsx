import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ onMenuClick }) => {
  const [notifications] = useState([
    { id: 1, title: 'New backlinks detected', time: '5 min ago' },
    { id: 2, title: 'Keyword ranking improved', time: '1 hour ago' },
    { id: 3, title: 'Site audit completed', time: '2 hours ago' }
  ])

  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="medium"
            onClick={onMenuClick}
            className="lg:hidden mr-4"
          >
            <ApperIcon name="Menu" size={24} />
          </Button>
          
          <div className="hidden md:block">
            <h1 className="text-2xl font-display font-bold text-gray-900">
              SEO Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor and optimize your website's search performance
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="medium"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <ApperIcon name="Bell" size={20} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50"
              >
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 hover:bg-gray-50 border-b border-gray-100">
                      <p className="text-sm text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <Button variant="ghost" size="small" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Export Button */}
          <Button variant="outline" size="medium">
            <ApperIcon name="Download" size={18} className="mr-2" />
            Export Data
          </Button>

          {/* Profile */}
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={20} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header