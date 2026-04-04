import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Design from './pages/Design';
import TryOn from './pages/TryOn';
import './styles/global.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"       element={<Home />} />
        <Route path="/design" element={<Design />} />
        <Route path="/tryon"  element={<TryOn />} />
      </Routes>
    </Router>
  );
}