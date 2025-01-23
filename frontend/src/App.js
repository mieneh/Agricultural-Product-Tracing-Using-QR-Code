import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/default/About';
import Contact from './pages/default/Contact';
import QR from './pages/default/QR';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Logout from './pages/auth/Logout';
import Notification from './pages/auth/Notification';
import Profile from './pages/auth/Profile';
import Admin from './pages/dashboard/Admin';
import Producer from './pages/dashboard/Producer';
import Transporter from './pages/dashboard/Transporter';
import Distributor from './pages/dashboard/Distributor';
import Transport from './pages/partner/Transport';
import Produce from './pages/partner/Produce';
import Product from './pages/request/Product';

import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/qr" element={<QR />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile" element={ <ProtectedRoute allowedRoles={["Admin", "Producer", "Transport", "Distributor"]}> <Profile /> </ProtectedRoute> } />
        <Route path="/notification" element={<Notification />} />
        <Route path="/admin" element={ <ProtectedRoute allowedRoles={["Admin"]}> <Admin /> </ProtectedRoute> } />
        <Route path="/producer" element={ <ProtectedRoute allowedRoles={["Producer"]}> <Producer /> </ProtectedRoute> } />
        <Route path="/transporter" element={ <ProtectedRoute allowedRoles={["Transport"]}> <Transporter /> </ProtectedRoute> } />
        <Route path="/distributor" element={ <ProtectedRoute allowedRoles={["Distributor"]}> <Distributor /> </ProtectedRoute> } />
        <Route path="/transport" element={ <ProtectedRoute allowedRoles={["Producer"]}> <Transport /> </ProtectedRoute> } />
        <Route path="/produce" element={ <ProtectedRoute allowedRoles={["Transport"]}> <Produce /> </ProtectedRoute> } />
        <Route path="/product" element={ <ProtectedRoute allowedRoles={["Producer", "Distributor"]}> <Product /> </ProtectedRoute> } />

      </Routes>
    </Router>
  );
};

export default App;