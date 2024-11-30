import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/default/About';
import Contact from './pages/default/Contact';
import QR from './pages/default/QR';

const App = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/qr" element={<QR />} />

      </Routes>
    </Router>
  );
};

export default App;