import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize editingProduct with default values
  const [editingProduct, setEditingProduct] = useState({
    image: "",
    code: "",
    name: "",
    price: "",
    description: "",
    size: "",
  });

  // State for error management
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        if (response.data) {
          setEditingProduct(response.data);
        } else {
          console.error("Không tìm thấy sản phẩm");
          navigate("/products");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
        if (error.response && error.response.status === 404) {
          alert("Sản phẩm không tồn tại");
          navigate("/products");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // Handle input changes in form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({
      ...editingProduct,
      [name]: value,
    });
  };

  // Handle product update
  const handleUpdateProduct = async () => {
    try {
      setError("");
      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        editingProduct
      );
      setSuccessMessage("Cập nhật sản phẩm thành công!");
      setTimeout(() => {
        navigate("/products");
      }, 1500);
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      if (error.response && error.response.status === 400) {
        setError("Mã sản phẩm hoặc tên sản phẩm đã tồn tại");
      } else {
        setError("Có lỗi xảy ra khi cập nhật sản phẩm");
      }
    }
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2">Đang tải thông tin sản phẩm...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white p-4">
              <h2 className="mb-0 text-center">Chỉnh sửa sản phẩm</h2>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="mb-4">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </Alert>
              )}
              {successMessage && (
                <Alert variant="success" className="mb-4">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {successMessage}
                </Alert>
              )}

              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold">Hình ảnh URL</Form.Label>
                      <Form.Control
                        type="text"
                        name="image"
                        value={editingProduct.image}
                        onChange={handleInputChange}
                        className="py-2"
                        placeholder="Nhập URL hình ảnh"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold">Mã sản phẩm</Form.Label>
                      <Form.Control
                        type="text"
                        name="code"
                        value={editingProduct.code}
                        onChange={handleInputChange}
                        className="py-2"
                        placeholder="Nhập mã sản phẩm"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Tên sản phẩm</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={editingProduct.name}
                    onChange={handleInputChange}
                    className="py-2"
                    placeholder="Nhập tên sản phẩm"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold">Giá (VND)</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={editingProduct.price}
                        onChange={handleInputChange}
                        className="py-2"
                        placeholder="Nhập giá sản phẩm"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold">Kích cỡ</Form.Label>
                      <Form.Control
                        type="text"
                        name="size"
                        value={editingProduct.size}
                        onChange={handleInputChange}
                        className="py-2"
                        placeholder="Nhập kích cỡ"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Mô tả sản phẩm</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={editingProduct.description}
                    onChange={handleInputChange}
                    className="py-2"
                    placeholder="Nhập mô tả chi tiết về sản phẩm"
                  />
                </Form.Group>

                <div className="d-flex justify-content-center gap-3 mt-4">
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/products")}
                    className="px-4 py-2"
                  >
                    Quay về
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleUpdateProduct}
                    className="px-4 py-2"
                  >
                    Cập nhật sản phẩm
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          
          {editingProduct.image && (
            <Card className="mt-4 shadow-sm border-0">
              <Card.Header className="bg-light p-3">
                <h4 className="mb-0">Xem trước hình ảnh</h4>
              </Card.Header>
              <Card.Body className="p-3 text-center">
                <img
                  src={editingProduct.image}
                  alt={editingProduct.name}
                  className="img-fluid"
                  style={{ maxHeight: "300px", objectFit: "contain" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x300?text=Hình+ảnh+không+tồn+tại";
                  }}
                />
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default EditProductPage;