import logo from './logo.svg';
import './App.css';
import PaymentPage from './pages/PaymentPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage'
import RestaurantDashboard from './pages/RestuarantDashboard'
import RestaurantMenu from "./pages/RestaurantMenu"; // We'll create this next
import MenuPage from './pages/MenuPage';
import TrackOrderPage from './pages/TrackOrderPage';
import { useParams } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customer-dashboard" element={<HomePage />} />
        <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
        <Route path="/restaurant/:id/menu" element={<RestaurantMenu />} />
        <Route path="/Payment-dashboard" element={<PaymentPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/track/:orderId" element={<TrackOrderWrapper />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}


function TrackOrderWrapper() {
  const { orderId } = useParams();
  return <TrackOrderPage orderId={orderId} />;
}

export default App;
