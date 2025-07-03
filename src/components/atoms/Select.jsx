import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Select = forwardRef(({ 
  label, 
  options = [], 
  error, 
  placeholder = 'Select an option',
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full px-4 py-3 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-secondary/20 focus:border-secondary 
            transition-all duration-200 appearance-none
            ${error ? 'border-error focus:border-error focus:ring-error/20' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ApperIcon 
          name="ChevronDown" 
          size={20} 
          className="absolute right-3 top-3.5 text-gray-400 pointer-events-none"
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select