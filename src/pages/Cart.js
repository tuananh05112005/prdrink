import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaCreditCard, FaArrowLeft, FaCheck, FaChartLine  } from "react-icons/fa";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false); // Hiển thị modal hủy đơn
  const [selectedItem, setSelectedItem] = useState(null); // Sản phẩm được chọn để hủy
  const [cancellationReason, setCancellationReason] = useState(""); // Lý do hủy
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage, setItemsPerPage] = useState(5); // Số lượng sản phẩm trên mỗi trang
  const [allOrders, setAllOrders] = useState([]); // State để lưu tất cả đơn hàng
  const [totalRevenue, setTotalRevenue] = useState(0); // State để lưu tổng doanh thu
    const [sortOrder, setSortOrder] = useState("asc"); // Hướng sắp xếp (asc hoặc desc)
    const [sortField, setSortField] = useState("id"); // Trường sắp xếp
  
  

  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id"); // Lấy user_id từ localStorage
  const role = localStorage.getItem("role"); // Lấy role từ localStorage

  // Lấy giỏ hàng từ API
  const fetchCartItems = async () => {
    try {
      let url = `http://localhost:5000/api/cart/${user_id}`;
      if (role === "admin") {
        url = `http://localhost:5000/api/admin/orders`; // Lấy tất cả đơn hàng nếu là admin
      }
      const response = await axios.get(url);
      setCartItems(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    }
  };
  // Tính tổng doanh thu
  const fetchTotalRevenue = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/revenue");
      setTotalRevenue(response.data.total_revenue || 0);
    } catch (error) {
      console.error("Lỗi khi lấy tổng doanh thu:", error);
    }
  };

  useEffect(() => {
    if (user_id) {
      fetchCartItems();
      if (role === "admin") {
        fetchTotalRevenue(); // Chỉ tính tổng doanh thu nếu là admin
      }
    } else {
      alert("Vui lòng đăng nhập để xem giỏ hàng");
      navigate("/login");
    }
  }, [user_id, navigate, role]);

  useEffect(() => {
    if (user_id) {
      fetchCartItems();
    } else {
      alert("Vui lòng đăng nhập để xem giỏ hàng");
      navigate("/login"); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    }
  }, [user_id, navigate]);

  // // Xóa sản phẩm khỏi giỏ hàng
  // const handleRemoveItem = async (itemId) => {
  //   try {
  //     await axios.delete(`http://localhost:5000/api/cart/remove/${itemId}`);
  //     fetchCartItems(); // Cập nhật lại giỏ hàng sau khi xóa
  //   } catch (error) {
  //     console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
  //   }
  // };

  // Cập nhật số lượng sản phẩm
  const handleQuantityChange = async (id, newQuantity) => {
    if (!id || isNaN(newQuantity) || newQuantity < 1) {
      console.error("Giá trị không hợp lệ:", { id, newQuantity });
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/cart/update/${id}`, {
        quantity: newQuantity,
      });

      console.log("Phản hồi từ server:", response.data);
      fetchCartItems(); // Cập nhật lại giỏ hàng
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
    }
  };

  // Điều hướng đến trang thanh toán
  const handleCheckoutItem = (item) => {
    navigate("/payment", { state: { item } }); // Truyền thông tin sản phẩm qua state
  };

  // Mở modal hủy đơn
  const openCancelModal = (item) => {
    setSelectedItem(item); // Lưu sản phẩm được chọn
    setShowCancelModal(true); // Hiển thị modal
  };

  // Đóng modal hủy đơn
  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedItem(null);
    setCancellationReason(""); // Reset lý do hủy
  };

  // Xác nhận hủy đơn
  const handleConfirmCancel = async () => {
    if (!cancellationReason) {
      alert("Vui lòng chọn lý do hủy");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/cart/cancel/${selectedItem.id}`, {
        cancellation_reason: cancellationReason,
        status: "cancelled",
      });
      fetchCartItems(); // Cập nhật lại giỏ hàng
      alert("Đơn hàng đã được hủy thành công");
      closeCancelModal(); // Đóng modal
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
    }
  };

  const handleReceivedItem = async (item) => {
    try {
      await axios.put(`http://localhost:5000/api/cart/received/${item.id}`, {
        status: "received",
      });
      fetchCartItems(); // Cập nhật lại giỏ hàng
      alert("Đơn hàng đã được cập nhật thành đã nhận hàng");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    }
  };

  // Quay về trang sản phẩm
  const handleBackToProducts = () => {
    navigate("/products");
  };

  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);

  // Tính toán tổng số trang
  const totalPages = Math.ceil(cartItems.length / itemsPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };
  
  // Xử lý sắp xếp
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sortedCartItems = [...cartItems].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });

    setCartItems(sortedCartItems);
  };
  return (
    <div className="container mt-3 mt-md-5 p-2 p-md-4">
      <h1 className="text-center text-success mb-3 mb-md-4 fs-2 fs-md-1">Giỏ hàng</h1>
      {role === "admin" && (
        <div className="mb-3 mb-md-4 text-center">
          <h3 className="text-success fs-4 fs-md-3">
            <FaChartLine className="me-2" />
            Tổng doanh thu: <strong>{formatCurrency(totalRevenue)}</strong>
          </h3>
        </div>
      )}
  
      {/* Nút quay về trang sản phẩm */}
      <button
        className="btn btn-outline-secondary mb-3 mb-md-4 d-flex align-items-center"
        onClick={handleBackToProducts}
      >
        <FaArrowLeft className="me-2" />
        <span className="d-none d-sm-inline">Quay về trang sản phẩm</span>
        <span className="d-sm-none">Quay lại</span>
      </button>
  
      {/* Bảng giỏ hàng cho màn hình lớn */}
      <div className="table-responsive d-none d-lg-block">
        <table className="table table-hover table-bordered shadow-sm">
          <thead className="table-success">
            <tr>
              <th scope="col" className="text-center">
                STT
              </th>
              <th scope="col" className="text-center">
                Hình ảnh
              </th>
              <th scope="col" className="text-center">
                Mã SP
              </th>
              <th scope="col" className="text-center">
                Tên sản phẩm
              </th>
              <th scope="col" className="text-center">
                Giá
              </th>
              <th scope="col" className="text-center">
                SL
              </th>
              <th scope="col" className="text-center">
                Thành tiền
              </th>
              <th scope="col" className="text-center">
                Size
              </th>
              <th
                scope="col"
                className="text-center"
                onClick={() => handleSort("order_date")}
              >
                Ngày đặt{" "}
                {sortField === "order_date" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th scope="col" className="text-center">
                Trạng thái
              </th>
              <th scope="col" className="text-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id} className="align-middle">
                <td className="text-center">{indexOfFirstItem + index + 1}</td>
                <td className="text-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-fluid rounded shadow-sm"
                    style={{ width: "80px", height: "80px" }}
                  />
                </td>
                <td className="text-center text-success fw-bold">{item.code}</td>
                <td className="text-center">{item.name}</td>
                <td className="text-center">{formatCurrency(item.price)}</td>
                <td className="text-center">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                    className="form-control mx-auto"
                    disabled={
                      item.status === "completed" ||
                      item.status === "cancelled" ||
                      item.status === "received"
                    }
                    style={{ width: "70px" }}
                  />
                </td>
                <td className="text-center fw-bold">
                  {formatCurrency(item.price * item.quantity)}
                </td>
                <td className="text-center">{item.size}</td>
                <td className="text-center">
                  {new Date(item.order_date).toLocaleDateString()}
                </td>
                <td className="text-center">
                  {getStatusBadge(item.status, role)}
                </td>
                <td className="text-center">
                  {getActionButtons(item, role)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Card view cho màn hình nhỏ và tablet */}
      <div className="d-lg-none">
        {currentItems.map((item, index) => (
          <div key={item.id} className="card mb-3 shadow-sm">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <span className="badge bg-secondary">{indexOfFirstItem + index + 1}</span>
              <span className="text-success fw-bold">{item.code}</span>
              {getStatusBadge(item.status, role)}
            </div>
            <div className="row g-0">
              <div className="col-4 col-md-3 p-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="img-fluid rounded h-100 object-fit-cover"
                  style={{ maxHeight: "150px" }}
                />
              </div>
              <div className="col-8 col-md-9">
                <div className="card-body p-2 p-md-3">
                  <h5 className="card-title mb-1">{item.name}</h5>
                  <div className="row mb-2">
                    <div className="col-6">
                      <p className="card-text mb-1 small">Giá: {formatCurrency(item.price)}</p>
                      <p className="card-text mb-1 small">Kích thước: {item.size}</p>
                      <p className="card-text mb-1 small">Ngày: {new Date(item.order_date).toLocaleDateString()}</p>
                    </div>
                    <div className="col-6">
                      <div className="d-flex flex-column">
                        <div className="input-group input-group-sm mb-2">
                          <span className="input-group-text">SL</span>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item.id, parseInt(e.target.value))
                            }
                            className="form-control"
                            disabled={
                              item.status === "completed" ||
                              item.status === "cancelled" ||
                              item.status === "received"
                            }
                            style={{ width: "60px" }}
                          />
                        </div>
                        <p className="card-text fw-bold text-end">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-2">
                    {getActionButtonsMobile(item, role)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
  
      {/* Phân trang */}
      <div className="d-flex justify-content-center mt-3 mt-md-4">
        <button
          className="btn btn-outline-secondary mx-1"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <span className="d-none d-sm-inline">Trang trước</span>
          <span className="d-sm-none">←</span>
        </button>
        <span className="mx-2 align-self-center">
          {currentPage} / {totalPages}
        </span>
        <button
          className="btn btn-outline-secondary mx-1"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <span className="d-none d-sm-inline">Trang sau</span>
          <span className="d-sm-none">→</span>
        </button>
      </div>
  
      {/* Modal hủy đơn */}
      <Modal show={showCancelModal} onHide={closeCancelModal} fullscreen="sm-down">
        <Modal.Header closeButton>
          <Modal.Title>Hủy đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Lý do hủy</Form.Label>
              <Form.Control
                as="select"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
              >
                <option value="">Chọn lý do hủy</option>
                <option value="Không còn nhu cầu">Không còn nhu cầu</option>
                <option value="Đặt nhầm sản phẩm">Đặt nhầm sản phẩm</option>
                <option value="Giao hàng chậm">Giao hàng chậm</option>
                <option value="Lý do khác">Lý do khác</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCancelModal}>
            Đóng
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel}>
            Xác nhận hủy
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
  
  // Helper functions for status badges and action buttons
  function getStatusBadge(status, role) {
    if (role === "user") {
      switch (status) {
        case "pending":
          return <span className="badge bg-warning">Chưa thanh toán</span>;
        case "completed":
          return <span className="badge bg-primary">Đã thanh toán</span>;
        case "received":
          return <span className="badge bg-success">Đã nhận hàng</span>;
        case "cancelled":
          return <span className="badge bg-danger">Đã hủy</span>;
        default:
          return <span className="badge bg-secondary">Không xác định</span>;
      }
    } else {
      switch (status) {
        case "pending":
          return <span className="badge bg-warning">Đang xử lý</span>;
        case "completed":
          return <span className="badge bg-primary">Đang giao</span>;
        case "received":
          return <span className="badge bg-success">Đã giao</span>;
        case "cancelled":
          return <span className="badge bg-danger">Đơn bị hủy</span>;
        default:
          return <span className="badge bg-secondary">Không xác định</span>;
      }
    }
  }
  
  function getActionButtons(item, role) {
    if (role === "user") {
      if (item.status === "completed" && item.status !== "received") {
        return (
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="btn btn-danger btn-sm"
              onClick={() => openCancelModal(item)}
            >
              <FaTimes /> Hủy
            </button>
            <button
              className="btn btn-info btn-sm"
              onClick={() => handleReceivedItem(item)}
            >
              <FaCheck /> Đã nhận
            </button>
          </div>
        );
      } else if (item.status === "pending") {
        return (
          <button
            className="btn btn-success btn-sm"
            onClick={() => handleCheckoutItem(item)}
          >
            <FaCreditCard /> Thanh toán
          </button>
        );
      }
    } else {
      if (item.status !== "cancelled" && item.status !== "delivered") {
        return (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => openCancelModal(item)}
          >
            <FaTimes /> Hủy đơn
          </button>
        );
      }
    }
    return null;
  }
  
  function getActionButtonsMobile(item, role) {
    if (role === "user") {
      if (item.status === "completed" && item.status !== "received") {
        return (
          <>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => openCancelModal(item)}
            >
              <FaTimes /> Hủy đơn
            </button>
            <button
              className="btn btn-info btn-sm"
              onClick={() => handleReceivedItem(item)}
            >
              <FaCheck /> Đã nhận hàng
            </button>
          </>
        );
      } else if (item.status === "pending") {
        return (
          <button
            className="btn btn-success btn-sm w-100"
            onClick={() => handleCheckoutItem(item)}
          >
            <FaCreditCard /> Thanh toán
          </button>
        );
      }
    } else {
      if (item.status !== "cancelled" && item.status !== "delivered") {
        return (
          <button
            className="btn btn-danger btn-sm w-100"
            onClick={() => openCancelModal(item)}
          >
            <FaTimes /> Hủy đơn
          </button>
        );
      }
    }
    return null;
  }
};

export default Cart;