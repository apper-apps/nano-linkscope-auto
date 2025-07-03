import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isOpen, onClose }) => {
  const [hoveredItem, setHoveredItem] = useState(null)

  const menuItems = [
    { path: '/', label: 'Overview', icon: 'BarChart3' },
    { path: '/backlinks', label: 'Backlinks', icon: 'Link' },
    { path: '/keywords', label: 'Keywords', icon: 'Search' },
    { path: '/site-audit', label: 'Site Audit', icon: 'ShieldCheck' },
    { path: '/competitors', label: 'Competitors', icon: 'Users' },
    { path: '/rank-tracker', label: 'Rank Tracker', icon: 'TrendingUp' }
  ]

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-white">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <ApperIcon name="Link" size={24} className="text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-display font-bold text-gray-900">
              LinkScope Pro
            </h1>
            <p className="text-sm text-gray-500">SEO Analytics</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose?.()}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-secondary text-white shadow-lg shadow-secondary/25'
                    : 'text-gray-700 hover:bg-surface hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <ApperIcon 
                    name={item.icon} 
                    size={20} 
                    className={`mr-3 transition-all duration-200 ${
                      isActive 
                        ? 'text-white' 
                        : hoveredItem === item.path 
                          ? 'text-secondary' 
                          : 'text-gray-500'
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-3 w-2 h-2 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <div className="bg-gradient-surface rounded-xl p-4">
          <div className="flex items-center mb-2">
            <ApperIcon name="Zap" size={20} className="text-secondary mr-2" />
            <span className="font-medium text-gray-900">Pro Features</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Unlock advanced analytics and unlimited tracking
          </p>
          <button className="w-full bg-gradient-accent text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-80 lg:bg-white lg:border-r lg:border-gray-200 lg:shadow-lg">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {/* Overlay */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
        )}

        {/* Sidebar */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: isOpen ? 0 : '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 w-80 h-full bg-white shadow-2xl z-50"
        >
          <div className="absolute top-4 right-4 lg:hidden">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" size={24} className="text-gray-600" />
            </button>
          </div>
          <SidebarContent />
        </motion.div>
      </div>
    </>
  )
}

export default Sidebar