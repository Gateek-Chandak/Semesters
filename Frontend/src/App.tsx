import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import GradesPage from './Pages/Grades'
import HomePage from './Pages/Home';

function App() {
  return (
    <Router>
      <div className="h-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<GradesPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
