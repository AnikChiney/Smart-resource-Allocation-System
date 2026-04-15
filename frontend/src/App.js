import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from './pages/dashboard';
import Review from './pages/review';
import Volunteers from './pages/volunteers';
import PriorityDashboard from './pages/PriorityDashboard';
import Matching from './pages/Matching';
import DataCollection from './pages/DataCollection';
import Header from './pages/header';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<DataCollection />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/review" element={<Review />} />
          <Route path='/volunteers' element={<Volunteers/>}/>
          <Route path='/priority' element={<PriorityDashboard/>}/>
          <Route path='/matching' element={<Matching/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;