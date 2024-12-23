import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Toaster } from "@/components/ui/toaster";

import LandingPage from './Pages/LandingPages/Landing';
import HomePage from './Pages/HomePages/HomePage';
import CoursePage from './Pages/HomePages/CoursePage';
import Dashboard from './components/Dashboard';
import TermPage from './Pages/HomePages/TermPage';

function App() {
  return (
    <Router>
      <div className="h-full">
        <Routes>
          {/* Landing page route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Home route with nested routes */}
          <Route path="/home" element={<HomePage />}>
            {/* Nested route for dynamic courses */}
            <Route index element={<Dashboard />} />
            <Route path=":term/:course" element={<CoursePage />} />
            <Route path=":term" element={<TermPage />} />
          </Route>
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
