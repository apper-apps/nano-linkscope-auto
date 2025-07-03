import { Route, BrowserRouter, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LinkOpportunities from "@/components/pages/LinkOpportunities";
import React from "react";
import Layout from "@/components/organisms/Layout";
import Keywords from "@/components/pages/Keywords";
import Competitors from "@/components/pages/Competitors";
import Overview from "@/components/pages/Overview";
import Backlinks from "@/components/pages/Backlinks";
import SiteAudit from "@/components/pages/SiteAudit";
import RankTracker from "@/components/pages/RankTracker";

function App() {
  return (
<BrowserRouter>
      <div className="min-h-screen bg-white">
        <Layout>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/backlinks" element={<Backlinks />} />
            <Route path="/keywords" element={<Keywords />} />
            <Route path="/site-audit" element={<SiteAudit />} />
            <Route path="/competitors" element={<Competitors />} />
            <Route path="/rank-tracker" element={<RankTracker />} />
            <Route path="/link-opportunities" element={<LinkOpportunities />} />
          </Routes>
        </Layout>
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
</BrowserRouter>
  );
}

export default App;