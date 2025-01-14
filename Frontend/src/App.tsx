import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Toaster } from "@/components/ui/toaster";

import LandingPage from './Pages/LandingPages/Landing';
import HomePage from './Pages/HomePages/HomePage';
import CoursePage from './Pages/HomePages/CoursePage';
import Dashboard from './Pages/HomePages/Dashboard';
import TermPage from './Pages/HomePages/TermPage';
import PrivacyPolicyTermsConditions from './Pages/LandingPages/PP&TC.js';

import ProtectedRoute from './components/ProtectedRoute.js'

function App() {

  return (
    <Router>
      <div className="h-full bg-[#f7f7f7]">
        <Routes>
          {/* Landing page route */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy-policy-and-terms-conditions" element={<PrivacyPolicyTermsConditions />} />
          {/* Home route with nested routes */}
          <Route path="/home" 
                 element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  }>
            {/* Nested route for dynamic courses */}

            <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path=":term/:course" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
            <Route path=":term" element={<ProtectedRoute><TermPage /></ProtectedRoute>} />
          </Route>
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
