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
    <div className="container mt-5 p-4">
      <h1 className="text-center text-success mb-4">Giỏ hàng</h1>
      {role === "admin" && (
        <div className="mb-4 text-center">
          <h3 className="text-success">
            <FaChartLine className="me-2" />
            Tổng doanh thu: <strong>{formatCurrency(totalRevenue)}</strong>
          </h3>
        </div>
      )}
  
      {/* Nút quay về trang sản phẩm */}
      <button
        className="btn btn-outline-secondary mb-4 d-flex align-items-center"
        onClick={handleBackToProducts}
      >
        <FaArrowLeft className="me-2" />
        Quay về trang sản phẩm
      </button>
  
      {/* Bảng giỏ hàng */}
      <div className="table-responsive">
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
                Mã sản phẩm
              </th>
              <th scope="col" className="text-center">
                Tên sản phẩm
              </th>
              <th scope="col" className="text-center">
                Giá
              </th>
              <th scope="col" className="text-center">
                Số lượng
              </th>
              <th scope="col" className="text-center">
                Thành tiền
              </th>
              <th scope="col" className="text-center">
                Kích thước
              </th>
              <th
                scope="col"
                className="text-center"
                onClick={() => handleSort("order_date")}
              >
                Ngày đặt hàng{" "}
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
                  {role === "user" ? (
                    // Trạng thái cho user
                    item.status === "pending" ? (
                      <span className="badge bg-warning">Chưa thanh toán</span>
                    ) : item.status === "completed" ? (
                      <span className="badge bg-primary">Đã thanh toán</span>
                    ) : item.status === "received" ? (
                      <span className="badge bg-success">Đã nhận hàng</span>
                    ) : item.status === "cancelled" ? (
                      <span className="badge bg-danger">Đã hủy</span>
                    ) : (
                      <span className="badge bg-secondary">Không xác định</span>
                    )
                  ) : (
                    // Trạng thái cho admin
                    item.status === "pending" ? (
                      <span className="badge bg-warning">Đang xử lý</span>
                    ) : item.status === "completed" ? (
                      <span className="badge bg-primary">Đang giao</span>
                    ) : item.status === "received" ? (
                      <span className="badge bg-success">Đã giao</span>
                    ) : item.status === "cancelled" ? (
                      <span className="badge bg-danger">Đơn bị hủy</span>
                    ) : (
                      <span className="badge bg-secondary">Không xác định</span>
                    )
                  )}
                </td>
                <td className="text-center">
                  {role === "user" ? (
                    // Hành động cho user
                    <>
                      {item.status === "completed" && item.status !== "received" && (
                        <div className="d-flex gap-2 justify-content-center">
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
                            <FaCheck /> Đã nhận
                          </button>
                        </div>
                      )}
                      {item.status === "pending" && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleCheckoutItem(item)}
                        >
                          <FaCreditCard /> Thanh toán
                        </button>
                      )}
                    </>
                  ) : (
                    // Hành động cho admin
                    <>
                      {item.status !== "cancelled" && item.status !== "delivered" && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => openCancelModal(item)}
                        >
                          <FaTimes /> Hủy đơn
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Phân trang */}
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-outline-secondary mx-1"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Trang trước
        </button>
        <span className="mx-2 align-self-center">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="btn btn-outline-secondary mx-1"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Trang sau
        </button>
      </div>
  
      {/* Modal hủy đơn */}
      <Modal show={showCancelModal} onHide={closeCancelModal}>
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
};

export default Cart;