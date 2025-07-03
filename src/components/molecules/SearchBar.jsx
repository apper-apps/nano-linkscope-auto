import { useState } from 'react'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ 
  onSearch, 
  placeholder = "Enter domain name...", 
  buttonText = "Analyze",
  className = ''
}) => {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    try {
      await onSearch(query.trim())
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-3 ${className}`}>
      <div className="flex-1">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="h-12"
        />
      </div>
      <Button
        type="submit"
        disabled={!query.trim() || isLoading}
        className="h-12 px-6"
      >
        {isLoading ? (
          <>
            <ApperIcon name="Loader2" size={18} className="mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <ApperIcon name="Search" size={18} className="mr-2" />
            {buttonText}
          </>
        )}
      </Button>
    </form>
  )
}

export default SearchBar