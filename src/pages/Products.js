import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaCartPlus,
  FaSearch,
  FaEye,
} from "react-icons/fa";
import axios from "axios";

import { useNavigate, useSearchParams } from "react-router-dom"; // Thêm useNavigate

import ChatBox from "./ChatBox";
const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]); // State để quản lý giỏ hàng
  const [sortField, setSortField] = useState(null); // Trường sắp xếp
  const [sortOrder, setSortOrder] = useState("asc"); // Hướng sắp xếp (asc hoặc desc)
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage, setItemsPerPage] = useState(5); // Số lượng sản phẩm trên mỗi trang

  const role = localStorage.getItem("role");
  const navigate = useNavigate(); // Sử dụng hook navigate để chuyển trang

  // Lấy giỏ hàng từ API
  const fetchCartItems = async () => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      alert("Vui lòng đăng nhập để xem giỏ hàng");
      navigate("/login"); // Chuyển hướng đến trang đăng nhập
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/cart/${user_id}`
      );
      console.log("Dữ liệu giỏ hàng nhận được:", response.data); // Debug
      setCartItems(response.data); // Cập nhật state cartItems
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      alert("Có lỗi xảy ra khi lấy giỏ hàng. Vui lòng thử lại.");
    }
  };

  // Khôi phục cartItems từ localStorage khi component được tải
  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(savedCartItems);
  }, []);

  // Lưu cartItems vào localStorage mỗi khi nó thay đổi
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Cập nhật URL khi thay đổi trang hoặc limit
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage);
    params.set("limit", itemsPerPage);
    setSearchParams(params);
  }, [currentPage, itemsPerPage]);

  // Lấy giá trị page và limit từ URL khi component được tải
  useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;
    setCurrentPage(page);
    setItemsPerPage(limit);
  }, [searchParams]);

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  // Xử lý mở trang chỉnh sửa sản phẩm
  const handleEditClick = (productId) => {
    navigate(`/edit-product/${productId}`); // Chuyển hướng đến trang chỉnh sửa
  };

  // Xử lý xóa sản phẩm
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`);
        setProducts(products.filter((product) => product.id !== productId));
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        alert("Không thể xóa sản phẩm vì có dữ liệu liên quan.");
      }
    }
  };

  // Xử lý thêm sản phẩm vào giỏ hàng
  // Xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async (product) => {
    const user_id = localStorage.getItem("user_id");
    console.log("user_id từ localStorage:", user_id);
    if (!user_id) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    try {
      console.log("Thêm sản phẩm vào giỏ hàng:", product); // Debug
      const response = await axios.post("http://localhost:5000/api/cart/add", {
        user_id: user_id,
        product_id: product.id,
        quantity: 1,
        size: product.size || "M",
      });
      console.log("Phản hồi từ API:", response.data); // Debug
      alert(`Đã thêm sản phẩm ${product.name} vào giỏ hàng`);
      fetchCartItems(); // Cập nhật lại giỏ hàng
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    }
  };

  // Xử lý chuyển trang sang giỏ hàng
  const handleViewCart = () => {
    const savedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    // if (savedCartItems.length === 0) {
    //   alert("Giỏ hàng trống!");
    //   return;
    // }
    navigate("/carts", { state: { cartItems: savedCartItems } });
  };
  // Xử lý sắp xếp
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sortedProducts = [...products].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });

    setProducts(sortedProducts);
  };

  // Xử lý tìm kiếm
  const filteredProducts = products.filter((product) => {
    const name = product.name?.toLowerCase() || "";
    const code = product.code?.toLowerCase() || "";
    const description = product.description?.toLowerCase() || "";
    const searchTermLower = searchTerm.toLowerCase();

    return (
      name.includes(searchTermLower) ||
      code.includes(searchTermLower) ||
      description.includes(searchTermLower)
    );
  });

  // Xử lý phân trang
  // Tính toán chỉ số bắt đầu và kết thúc của sản phẩm trên trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Tính toán tổng số trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleLimitChange = (limit) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Reset về trang đầu tiên
  };

  return (
    <div className="container mt-3 mt-md-5 p-2 p-md-4 bg-white">
      <h1 className="text-center text-success mb-3 mb-md-4 fs-2 fs-md-1">
        Danh sách sản phẩm
      </h1>

      {/* Nút thêm sản phẩm và xem giỏ hàng */}
      <div className="d-flex flex-column flex-sm-row justify-content-between mb-3 mb-md-4 gap-2">
        {role === "admin" && (
          <button
            className="btn btn-success d-flex align-items-center justify-content-center"
            onClick={() => navigate("/add-product")} // Chuyển hướng đến trang thêm sản phẩm
          >
            <FaPlus className="me-2" />
            Thêm sản phẩm
          </button>
        )}
        <button
          className="btn btn-primary d-flex align-items-center justify-content-center"
          onClick={handleViewCart}
        >
          <FaEye className="me-2" />
          Xem giỏ hàng
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="mb-3 mb-md-4">
        <div
          className="input-group"
          style={{ maxWidth: "100%", width: "300px" }}
        >
          <input
            type="text"
            className="form-control rounded-start-pill"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderRight: "none" }}
          />
          <button
            className="btn btn-outline-secondary rounded-end-pill"
            type="button"
            style={{ borderLeft: "none" }}
          >
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Bảng sản phẩm - hiển thị trên màn hình lớn */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-hover table-bordered shadow-sm">
          <thead className="table-success">
            <tr>
              <th
                scope="col"
                className="text-center"
                onClick={() => handleSort("id")}
              >
                STT{" "}
                {sortField === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th scope="col" className="text-center">
                Hình ảnh
              </th>
              <th
                scope="col"
                className="text-center"
                onClick={() => handleSort("code")}
              >
                Mã SP{" "}
                {sortField === "code" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th
                scope="col"
                className="text-center"
                onClick={() => handleSort("name")}
              >
                Tên sản phẩm{" "}
                {sortField === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th
                scope="col"
                className="text-center"
                onClick={() => handleSort("price")}
              >
                Giá{" "}
                {sortField === "price" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th scope="col" className="text-center">
                Mô tả
              </th>
              <th scope="col" className="text-center">
                Kích thước
              </th>
              <th scope="col" className="text-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product, index) => (
              <tr key={product.id} className="align-middle">
                <td className="text-center">{index + 1}</td>
                <td className="text-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="img-fluid rounded shadow-sm"
                    style={{ width: "80px", height: "80px" }}
                  />
                </td>
                <td className="text-center text-success fw-bold">
                  {product.code}
                </td>
                <td className="text-center">{product.name}</td>
                <td className="text-center">{formatCurrency(product.price)}</td>
                <td className="text-center">{product.description}</td>
                <td className="text-center">{product.size}</td>
                <td className="text-center">
                  {role === "admin" ? (
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEditClick(product.id)} // Sửa thành chuyển hướng
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleAddToCart(product)}
                    >
                      <FaCartPlus /> Thêm vào giỏ
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view cho màn hình nhỏ và tablet */}
      <div className="d-md-none">
        {currentItems.map((product) => (
          <div key={product.id} className="card mb-3 shadow-sm">
            <div className="row g-0">
              <div className="col-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="img-fluid rounded-start h-100 object-fit-cover"
                  style={{ maxHeight: "150px" }}
                />
              </div>
              <div className="col-8">
                <div className="card-body p-2 p-sm-3">
                  <h5 className="card-title mb-1">{product.name}</h5>
                  <p className="card-text mb-1 text-success fw-bold">
                    {product.code}
                  </p>
                  <p className="card-text mb-1 fw-bold">
                    {formatCurrency(product.price)}
                  </p>
                  <p className="card-text mb-1 small text-muted">
                    Kích thước: {product.size}
                  </p>
                  <p className="card-text small mb-2 d-none d-sm-block text-truncate">
                    {product.description}
                  </p>

                  {role === "admin" ? (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEditClick(product.id)}
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <FaTrash /> Xóa
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-success btn-sm w-100"
                      onClick={() => handleAddToCart(product)}
                    >
                      <FaCartPlus /> Thêm vào giỏ
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3 mt-md-4">
        {/* Phần limit */}
        <div className="d-flex gap-2 align-items-center">
          <span>Hiển thị:</span>
          <select
            className="form-select"
            value={itemsPerPage}
            onChange={(e) => handleLimitChange(parseInt(e.target.value))}
            style={{ width: "80px" }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>sản phẩm</span>
        </div>

        {/* Phần phân trang */}
        <div className="d-flex gap-2 align-items-center">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <span className="d-none d-sm-inline">Trang trước</span>
            <span className="d-sm-none">←</span>
          </button>
          <span className="mx-2">
            {currentPage} / {totalPages}
          </span>
          <button
            className="btn btn-outline-secondary"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <span className="d-none d-sm-inline">Trang sau</span>
            <span className="d-sm-none">→</span>
          </button>
        </div>
      </div>
      {/* <ChatBox />  */}
    </div>
  );
};

export default ProductTable;
