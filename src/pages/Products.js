import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrash, FaPlus, FaCartPlus, FaSearch, FaEye } from "react-icons/fa";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false); // State để hiển thị modal thêm sản phẩm
  const [showEditModal, setShowEditModal] = useState(false); // State để hiển thị modal sửa sản phẩm
  const [newProduct, setNewProduct] = useState({
    image: "",
    code: "",
    name: "",
    price: "",
    description: "",
    size: "",
  });
  const [editingProduct, setEditingProduct] = useState(null); // Sản phẩm đang được chỉnh sửa
  const [cartItems, setCartItems] = useState([]); // State để quản lý giỏ hàng
  const [sortField, setSortField] = useState(null); // Trường sắp xếp
  const [sortOrder, setSortOrder] = useState("asc"); // Hướng sắp xếp (asc hoặc desc)
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage, setItemsPerPage] = useState(5); // Số lượng sản phẩm trên mỗi trang

  const role = localStorage.getItem("role");
  const navigate = useNavigate(); // Sử dụng hook navigate để chuyển trang

   // Lấy giỏ hàng từ API
   const fetchCartItems = async () => {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      alert('Vui lòng đăng nhập để xem giỏ hàng');
      navigate('/login'); // Chuyển hướng đến trang đăng nhập
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:5000/api/cart/${user_id}`);
      console.log("Dữ liệu giỏ hàng nhận được:", response.data); // Debug
      setCartItems(response.data); // Cập nhật state cartItems
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error);
      alert('Có lỗi xảy ra khi lấy giỏ hàng. Vui lòng thử lại.'); 
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

  // Xử lý thay đổi input trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Xử lý thêm sản phẩm
  const handleAddProduct = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/products",
        newProduct
      );
      setProducts([...products, response.data]); // Cập nhật danh sách sản phẩm
      setShowModal(false); // Đóng modal
      setNewProduct({
        // Reset form
        image: "",
        code: "",
        name: "",
        price: "",
        description: "",
        size: "",
      });
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
    }
  };

  // Xử lý mở modal sửa sản phẩm
  const handleEditClick = (product) => {
    setEditingProduct(product); // Lưu sản phẩm đang được chỉnh sửa
    setShowEditModal(true); // Mở modal sửa
  };

  // Xử lý cập nhật sản phẩm
  const handleUpdateProduct = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/products/${editingProduct.id}`,
        editingProduct
      );
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id ? response.data : product
        )
      );
      setShowEditModal(false); // Đóng modal sửa
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
    }
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
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };
  

  return (
    <div className="container mt-5 p-4 bg-white">
      <h1 className="text-center text-success mb-4">Danh sách sản phẩm</h1>
  
      {/* Nút thêm sản phẩm và xem giỏ hàng */}
      <div className="d-flex justify-content-between mb-4">
        {role === "admin" && (
          <button
            className="btn btn-success d-flex align-items-center"
            onClick={() => setShowModal(true)}
          >
            <FaPlus className="me-2" />
            Thêm sản phẩm
          </button>
        )}
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={handleViewCart}
        >
          <FaEye className="me-2" />
          Xem giỏ hàng
        </button>
      </div>
  
      {/* Thanh tìm kiếm */}
      <div className="mb-4">
  <div className="input-group" style={{ maxWidth: "300px" }}>
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
  
      {/* Bảng sản phẩm */}
      <div className="table-responsive">
        <table className="table table-hover table-bordered shadow-sm">
          <thead className="table-success">
            <tr>
              <th
                scope="col"
                className="text-center"
                onClick={() => handleSort("id")}
              >
                STT {sortField === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th scope="col" className="text-center">
                Hình ảnh
              </th>
              <th
                scope="col"
                className="text-center"
                onClick={() => handleSort("code")}
              >
                Mã sản phẩm{" "}
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
                <td className="text-center text-success fw-bold">{product.code}</td>
                <td className="text-center">{product.name}</td>
                <td className="text-center">{formatCurrency(product.price)}</td>
                <td className="text-center">{product.description}</td>
                <td className="text-center">{product.size}</td>
                <td className="text-center">
                  {role === "admin" ? (
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEditClick(product)}
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
  
      {/* Modal thêm sản phẩm */}
      {role === "admin" && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Thêm sản phẩm mới</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Hình ảnh</Form.Label>
                <Form.Control
                  type="text"
                  name="image"
                  value={newProduct.image}
                  onChange={handleInputChange}
                  placeholder="Nhập URL hình ảnh"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mã sản phẩm</Form.Label>
                <Form.Control
                  type="text"
                  name="code"
                  value={newProduct.code}
                  onChange={handleInputChange}
                  placeholder="Nhập mã sản phẩm"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tên sản phẩm</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên sản phẩm"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giá</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  placeholder="Nhập giá"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Kích cỡ</Form.Label>
                <Form.Control
                  type="text"
                  name="size"
                  value={newProduct.size}
                  onChange={handleInputChange}
                  placeholder="Nhập kích cỡ"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Đóng
            </Button>
            <Button variant="primary" onClick={handleAddProduct}>
              Thêm
            </Button>
          </Modal.Footer>
        </Modal>
      )}
  
      {/* Modal sửa sản phẩm */}
      {role === "admin" && editingProduct && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Sửa sản phẩm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Hình ảnh</Form.Label>
                <Form.Control
                  type="text"
                  name="image"
                  value={editingProduct.image}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      image: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mã sản phẩm</Form.Label>
                <Form.Control
                  type="text"
                  name="code"
                  value={editingProduct.code}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      code: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tên sản phẩm</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giá</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Kích cỡ</Form.Label>
                <Form.Control
                  type="text"
                  name="size"
                  value={editingProduct.size}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      size: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Đóng
            </Button>
            <Button variant="primary" onClick={handleUpdateProduct}>
              Lưu
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ProductTable;
