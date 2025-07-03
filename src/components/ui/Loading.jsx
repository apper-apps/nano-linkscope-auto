import { motion } from 'framer-motion'

const Loading = ({ type = 'default' }) => {
  if (type === 'table') {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-12 rounded-lg bg-[length:200%_100%] skeleton"></div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-4 rounded mb-4 bg-[length:200%_100%] skeleton"></div>
              <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-8 rounded mb-2 bg-[length:200%_100%] skeleton"></div>
              <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-3 rounded w-1/2 bg-[length:200%_100%] skeleton"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'chart') {
    return (
      <div className="animate-pulse">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-6 rounded mb-6 w-1/4 bg-[length:200%_100%] skeleton"></div>
          <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-64 rounded bg-[length:200%_100%] skeleton"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

export default Loading