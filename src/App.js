import React, {useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Thay Switch bằng Routes
// import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import PaymentPage from './pages/PaymentPage';
import AdminStatistics from './pages/AdminStatistics';
import AddProductForm from './pages/AddProductForm';
import EditProductForm from './pages/EditProductForm';
import './App.css';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State để điều khiển Sidebar

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Đảo ngược trạng thái Sidebar
  };

  return (
    <Router>
      <div style={{ display: 'flex' }}>
      <Sidebar isSidebarOpen={isSidebarOpen} /> {/* Truyền state xuống Sidebar */}
        <div style={{ flex: 1 }}>
          {/* <Header toggleSidebar={toggleSidebar} /> Truyền hàm toggleSidebar xuống Header */}
          <Routes>
            {/* Sử dụng element thay vì component */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/carts" element={<Cart />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/admin/statistics" element={<AdminStatistics />} />
            <Route path="/add-product" element={<AddProductForm />} />
            <Route path="/edit-product/:id" element={<EditProductForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;