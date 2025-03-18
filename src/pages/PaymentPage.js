import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaCreditCard, FaMoneyBillWave, FaCheckCircle, 
  FaArrowLeft, FaUser, FaMapMarkerAlt, FaPhone, 
  FaLock, FaShoppingCart, FaTruck
} from "react-icons/fa";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {}; // Lấy thông tin sản phẩm từ state
  const user_id = localStorage.getItem("user_id"); // Lấy user_id từ localStorage
  
  const [paymentInfo, setPaymentInfo] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "cash",
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý thay đổi thông tin thanh toán
  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Chuyển sang bước tiếp theo
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!paymentInfo.name || !paymentInfo.address || !paymentInfo.phone) {
        alert("Vui lòng điền đầy đủ thông tin thanh toán");
        return;
      }
      setCurrentStep(2);
    }
  };

  // Quay lại bước trước
  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  // Xác nhận thanh toán
  const handleConfirmPayment = async () => {
    if (!paymentInfo.name || !paymentInfo.address || !paymentInfo.phone) {
      alert("Vui lòng điền đầy đủ thông tin thanh toán");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Gọi API để cập nhật trạng thái thanh toán
      await axios.put(`http://localhost:5000/api/cart/checkout-item/${item.id}`);

      // Lưu thông tin thanh toán vào bảng payments
      await axios.post("http://localhost:5000/api/payments", {
        user_id: user_id,
        product_id: item.product_id,
        name: paymentInfo.name,
        address: paymentInfo.address,
        phone: paymentInfo.phone,
        payment_method: paymentInfo.paymentMethod,
        amount: item.price * item.quantity,
      });

      // Hiển thị thông báo thành công với animation
      setCurrentStep(3);
      
      // Chuyển hướng sau 3 giây
      setTimeout(() => {
        navigate("/carts"); // Quay về trang giỏ hàng sau khi thanh toán
      }, 3000);
      
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại sau!");
      setIsSubmitting(false);
    }
  };

  // Nếu không có thông tin sản phẩm, quay về trang giỏ hàng
  useEffect(() => {
    if (!item) {
      navigate("/cart");
    }
  }, [item, navigate]);

  // Hiển thị tiến trình thanh toán
  const renderProgressBar = () => {
    return (
      <div className="d-flex justify-content-center mb-5">
        <div className="position-relative w-75">
          <div className="progress" style={{ height: "2px" }}>
            <div 
              className="progress-bar bg-success" 
              role="progressbar" 
              style={{ width: `${(currentStep - 1) * 50}%` }}
              aria-valuenow={(currentStep - 1) * 50} 
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
          </div>
          <div className="position-absolute top-0 start-0 translate-middle">
            <div className={`rounded-circle d-flex align-items-center justify-content-center ${currentStep >= 1 ? 'bg-success' : 'bg-secondary'}`} style={{ width: "40px", height: "40px" }}>
              <FaUser className="text-white" />
            </div>
            <div className="mt-2 text-center">
              <small>Thông tin</small>
            </div>
          </div>
          <div className="position-absolute top-0 start-50 translate-middle">
            <div className={`rounded-circle d-flex align-items-center justify-content-center ${currentStep >= 2 ? 'bg-success' : 'bg-secondary'}`} style={{ width: "40px", height: "40px" }}>
              <FaCreditCard className="text-white" />
            </div>
            <div className="mt-2 text-center">
              <small>Thanh toán</small>
            </div>
          </div>
          <div className="position-absolute top-0 end-0 translate-middle">
            <div className={`rounded-circle d-flex align-items-center justify-content-center ${currentStep >= 3 ? 'bg-success' : 'bg-secondary'}`} style={{ width: "40px", height: "40px" }}>
              <FaCheckCircle className="text-white" />
            </div>
            <div className="mt-2 text-center">
              <small>Hoàn tất</small>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Hiển thị thông tin sản phẩm
  const renderProductInfo = () => {
    return (
      <div className="card border-0 shadow-sm mb-4 overflow-hidden">
        <div className="card-header bg-light py-3">
          <h5 className="mb-0">
            <FaShoppingCart className="me-2 text-success" />
            Thông tin sản phẩm
          </h5>
        </div>
        <div className="card-body">
          {item && (
            <div className="row align-items-center">
              <div className="col-md-2 text-center mb-3 mb-md-0">
                <div className="bg-light p-3 rounded">
                  <img
                    src={item.image || "https://via.placeholder.com/100"}
                    alt={item.name}
                    className="img-fluid"
                    style={{ maxHeight: "80px", objectFit: "contain" }}
                  />
                </div>
              </div>
              <div className="col-md-6 mb-3 mb-md-0">
                <h5 className="fw-bold mb-1">{item.name}</h5>
                <p className="text-muted small mb-0">Mã sản phẩm: {item.product_id}</p>
                <div className="mt-2">
                  <span className="badge bg-light text-dark me-2">
                    Số lượng: {item.quantity}
                  </span>
                  <span className="badge bg-light text-dark">
                    Đơn giá: {item.price ? item.price.toLocaleString() + " ₫" : "N/A"}
                  </span>
                </div>
              </div>
              <div className="col-md-4 text-md-end">
                <p className="text-muted mb-1">Tổng tiền:</p>
                <h4 className="text-success fw-bold">
                  {(item.price * item.quantity).toLocaleString()} ₫
                </h4>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Hiển thị form nhập thông tin người nhận
  const renderDeliveryInfo = () => {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-light py-3">
          <h5 className="mb-0">
            <FaTruck className="me-2 text-success" />
            Thông tin giao hàng
          </h5>
        </div>
        <div className="card-body p-4">
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="form-label">
                <FaUser className="me-2 text-muted" />
                Tên người nhận
              </label>
              <input
                type="text"
                className="form-control form-control-lg border-0 bg-light"
                id="name"
                name="name"
                placeholder="Nhập tên người nhận"
                value={paymentInfo.name}
                onChange={handlePaymentInfoChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="form-label">
                <FaMapMarkerAlt className="me-2 text-muted" />
                Địa chỉ
              </label>
              <input
                type="text"
                className="form-control form-control-lg border-0 bg-light"
                id="address"
                name="address"
                placeholder="Nhập địa chỉ giao hàng"
                value={paymentInfo.address}
                onChange={handlePaymentInfoChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="form-label">
                <FaPhone className="me-2 text-muted" />
                Số điện thoại
              </label>
              <input
                type="text"
                className="form-control form-control-lg border-0 bg-light"
                id="phone"
                name="phone"
                placeholder="Nhập số điện thoại liên hệ"
                value={paymentInfo.phone}
                onChange={handlePaymentInfoChange}
                required
              />
            </div>
            <div className="d-grid">
              <button
                type="button"
                className="btn btn-success btn-lg py-3"
                onClick={handleNextStep}
              >
                Tiếp tục
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Hiển thị phương thức thanh toán
  const renderPaymentMethod = () => {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-light py-3">
          <h5 className="mb-0">
            <FaLock className="me-2 text-success" />
            Phương thức thanh toán
          </h5>
        </div>
        <div className="card-body p-4">
          <div className="mb-4">
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="cashPayment"
                value="cash"
                checked={paymentInfo.paymentMethod === "cash"}
                onChange={handlePaymentInfoChange}
              />
              <label className="form-check-label d-flex align-items-center" htmlFor="cashPayment">
                <div className="bg-light p-2 rounded-circle me-3">
                  <FaMoneyBillWave className="text-success" size={24} />
                </div>
                <div>
                  <p className="mb-0 fw-bold">Thanh toán tiền mặt</p>
                  <p className="text-muted small mb-0">Thanh toán khi nhận hàng (COD)</p>
                </div>
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="bankingPayment"
                value="banking"
                checked={paymentInfo.paymentMethod === "banking"}
                onChange={handlePaymentInfoChange}
              />
              <label className="form-check-label d-flex align-items-center" htmlFor="bankingPayment">
                <div className="bg-light p-2 rounded-circle me-3">
                  <FaCreditCard className="text-success" size={24} />
                </div>
                <div>
                  <p className="mb-0 fw-bold">Chuyển khoản ngân hàng</p>
                  <p className="text-muted small mb-0">Thanh toán qua tài khoản ngân hàng</p>
                </div>
              </label>
            </div>
          </div>

          {paymentInfo.paymentMethod === "banking" && (
            <div className="alert alert-info mb-4">
              <p className="mb-1 fw-bold">Thông tin tài khoản:</p>
              <p className="mb-1">Ngân hàng: BIDV</p>
              <p className="mb-1">Số tài khoản: 1234567890</p>
              <p className="mb-0">Chủ tài khoản: CÔNG TY XYZ</p>
            </div>
          )}

          <div className="row mt-4">
            <div className="col-6">
              <button
                type="button"
                className="btn btn-outline-secondary w-100 py-3"
                onClick={handlePrevStep}
              >
                <FaArrowLeft className="me-2" />
                Quay lại
              </button>
            </div>
            <div className="col-6">
              <button
                type="button"
                className="btn btn-success w-100 py-3"
                onClick={handleConfirmPayment}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="me-2" />
                    Xác nhận thanh toán
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Hiển thị thông báo thanh toán thành công
  const renderSuccess = () => {
    return (
      <div className="card border-0 shadow-sm text-center">
        <div className="card-body py-5">
          <div className="animated-check mb-4">
            <div className="bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{width: "100px", height: "100px"}}>
              <FaCheckCircle size={50} className="text-white" />
            </div>
          </div>
          <h3 className="text-success mb-3">Thanh toán thành công!</h3>
          <p className="text-muted mb-4">Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.</p>
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Đang chuyển hướng...</span>
            </div>
          </div>
          <p className="text-muted mt-3">Bạn sẽ được chuyển hướng trong vài giây...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="d-flex align-items-center mb-4">
            <button 
              className="btn btn-light rounded-circle me-3 shadow-sm" 
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft />
            </button>
            <h2 className="mb-0">Thanh toán</h2>
          </div>

          {renderProgressBar()}

          {currentStep < 3 && renderProductInfo()}

          {currentStep === 1 && renderDeliveryInfo()}
          {currentStep === 2 && renderPaymentMethod()}
          {currentStep === 3 && renderSuccess()}
        </div>
      </div>

      <style jsx>{`
        .animated-check {
          animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;