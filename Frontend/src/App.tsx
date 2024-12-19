import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Toaster } from "@/components/ui/toaster"
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import SideBar from './components/Sidebar'

import CoursePage from './Pages/HomePages/CoursePage';
import LandingPage from './Pages/LandingPages/Landing';

function App() {
  return (
    <Router>
      <div className="h-full">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<CoursePage />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App
