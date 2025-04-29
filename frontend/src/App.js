import logo from './logo.svg';
import './App.css';
import PaymentPage from './pages/PaymentPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage'
import RestaurantDashboard from './pages/RestuarantDashboard'
import RestaurantMenu from "./pages/RestaurantMenu"; // We'll create this next
import CartPage from './pages/CartPage';
import TrackOrderPage from './pages/TrackOrderPage';
import { useParams } from 'react-router-dom';
import { CartProvider } from "./contexts/CartContext";
import DeliveryDashboard from './pages/DeliveryDashboard';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/customer-dashboard" element={<HomePage />} />
          <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
          <Route path="/restaurant/:id/menu" element={<RestaurantMenu />} />
          <Route path="/Payment-dashboard" element={<PaymentPage />} />
          <Route path="/track/:orderId" element={<TrackOrderWrapper />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
          {/* Other routes */}
        </Routes>
      </Router>
    </CartProvider>
  );
}


function TrackOrderWrapper() {
  const { orderId } = useParams();
  return <TrackOrderPage orderId={orderId} />;
}

export default App;
