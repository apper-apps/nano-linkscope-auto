import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Overview from '@/components/pages/Overview'
import Backlinks from '@/components/pages/Backlinks'
import Keywords from '@/components/pages/Keywords'
import SiteAudit from '@/components/pages/SiteAudit'
import Competitors from '@/components/pages/Competitors'
import RankTracker from '@/components/pages/RankTracker'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="backlinks" element={<Backlinks />} />
            <Route path="keywords" element={<Keywords />} />
            <Route path="site-audit" element={<SiteAudit />} />
            <Route path="competitors" element={<Competitors />} />
            <Route path="rank-tracker" element={<RankTracker />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  )
}

export default App