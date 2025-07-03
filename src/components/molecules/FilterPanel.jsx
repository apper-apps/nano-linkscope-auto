import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const FilterPanel = ({ 
  filters = [], 
  onFilterChange,
  onReset,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filterValues, setFilterValues] = useState({})

  const handleFilterChange = (key, value) => {
    const newValues = { ...filterValues, [key]: value }
    setFilterValues(newValues)
    onFilterChange?.(newValues)
  }

  const handleReset = () => {
    setFilterValues({})
    onReset?.()
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
        >
          <div className="flex items-center">
            <ApperIcon name="Filter" size={20} className="mr-2" />
            Filters
          </div>
          <ApperIcon 
            name={isOpen ? "ChevronUp" : "ChevronDown"} 
            size={20} 
          />
        </Button>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {filters.map((filter) => (
                <div key={filter.key}>
                  {filter.type === 'select' ? (
                    <Select
                      label={filter.label}
                      options={filter.options}
                      value={filterValues[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    />
                  ) : (
                    <Input
                      label={filter.label}
                      type={filter.type}
                      value={filterValues[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      placeholder={filter.placeholder}
                    />
                  )}
                </div>
              ))}
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => onFilterChange?.(filterValues)}
                >
                  Apply Filters
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FilterPanel