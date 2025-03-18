import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    alert('Đăng xuất thành công!');
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <nav>
        <img src="/image/sidebar.jpg" alt="sidebar" />
        <Link to="/" className="link">Trang chủ</Link>
        <Link to="/products" className="link">Sản phẩm</Link>
        <div className="auth-dropdown" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="auth-button">
            Auth
          </button>
          {isDropdownOpen && (
            <div className="dropdown-content">
              <Link to="/login" className="dropdown-link">Đăng nhập</Link>
              <Link to="/register" className="dropdown-link">Đăng ký</Link>
              <button className="dropdown-link" onClick={handleLogout}>Đăng xuất</button>
            </div>
          )}
        </div>
        <Link to="/carts" className="link">Giỏ hàng</Link>
        <Link to="/admin/statistics"  className="link">Thống kê</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
