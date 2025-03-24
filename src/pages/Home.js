import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Initialize AOS with enhanced settings
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: false,
      mirror: true,
      anchorPlacement: 'top-bottom',
    });
    
    // Set loaded state after a short delay for entrance animation
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    // Refresh AOS on window resize
    window.addEventListener('resize', () => {
      AOS.refresh();
    });
    
    return () => {
      window.removeEventListener('resize', () => {
        AOS.refresh();
      });
    };
  }, []);

  // Parallax effect for scroll
  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`container-fluid p-0 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
         style={{ transition: 'opacity 1s ease-in-out' }}>
      {/* Banner with Parallax effect */}
      <header 
        className="position-relative text-white text-center bg-dark py-5" 
        style={{ 
          backgroundImage: "url('/image/banner.jpg')", 
          backgroundSize: 'cover', 
          backgroundPosition: `center ${scrollPosition * 0.2}px`, 
          height: '500px',
          transition: 'all 0.5s ease-out' 
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
        <div className="position-relative d-flex flex-column justify-content-center align-items-center h-100">
          <h1 className="fw-bold display-4" data-aos="zoom-in" data-aos-duration="1200">
            PRDrink - Thức uống hiện đại
          </h1>
          <p className="lead" data-aos="fade-up" data-aos-delay="400" data-aos-duration="1200">
            Trải nghiệm những hương vị tuyệt vời nhất
          </p>
          <Link 
            to="/products" 
            className="btn btn-warning btn-lg" 
            data-aos="fade-up" 
            data-aos-delay="800"
            onMouseOver={(e) => e.target.classList.add('animate__pulse')}
            onMouseOut={(e) => e.target.classList.remove('animate__pulse')}
          >
            Khám phá ngay
          </Link>
        </div>
      </header>

      {/* Danh mục sản phẩm với hover effects */}
      <section className="container my-5">
        <h2 className="text-center text-warning mb-4" data-aos="fade-up">
          Danh mục nổi bật
        </h2>
        <div className="row g-4">
          {[
            { name: 'Cà phê', image: '/image/7.png' }, 
            { name: 'Trà', image: '/image/16.png' }, 
            { name: 'Sinh tố', image: '/image/1.png' }, 
            { name: 'Trà sữa', image: '/image/10.png' }
          ].map((product, index) => (
            <div 
              key={index} 
              className="col-md-3" 
              data-aos="fade-up" 
              data-aos-delay={index * 150}
            >
              <div 
                className="card shadow-sm border-0 h-100" 
                style={{ 
                  transition: 'all 0.3s ease',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                <div className="overflow-hidden">
                  <img 
                    src={product.image} 
                    className="card-img-top" 
                    alt={product.name}
                    style={{
                      transition: 'transform 0.5s ease',
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title">{product.name}</h5>
                  <Link 
                    to="/products" 
                    className="btn btn-outline-warning"
                    style={{ transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => {
                      e.target.classList.remove('btn-outline-warning');
                      e.target.classList.add('btn-warning');
                      e.target.classList.add('text-white');
                    }}
                    onMouseOut={(e) => {
                      e.target.classList.remove('btn-warning');
                      e.target.classList.remove('text-white');
                      e.target.classList.add('btn-outline-warning');
                    }}
                  >
                    Xem thêm
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Giới thiệu với animated counters */}
      <section 
        className="py-5 text-center bg-light"
        style={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
          borderRadius: '0 60px 0 60px',
          margin: '20px 0',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
        }}
      >
        <div className="container" data-aos="fade-up">
          <h2 className="text-warning" data-aos="fade-down">Về PRDrink</h2>
          <p className="lead" data-aos="fade-up" data-aos-delay="200">
            PRDrink mang đến cho bạn những thức uống thơm ngon, chất lượng nhất.
          </p>
          <div className="row mt-4">
            {[
              { icon: '🌿', title: 'Nguyên liệu sạch', count: '100%' }, 
              { icon: '⭐', title: 'Chất lượng cao', count: '5.0' }, 
              { icon: '💯', title: 'Hương vị đặc biệt', count: '20+' }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="col-md-4"
                data-aos="zoom-in" 
                data-aos-delay={300 + (index * 150)}
              >
                <div 
                  className="card border-0 shadow-sm p-3 h-100"
                  style={{ 
                    transition: 'all 0.3s ease',
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: '15px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                  }}
                >
                  <h3 className="display-4">{feature.icon}</h3>
                  <h4 className="text-warning">{feature.count}</h4>
                  <h5>{feature.title}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - New */}
      <section className="container my-5">
        <h2 className="text-center text-warning mb-4" data-aos="fade-up">
          Khách hàng nói gì về chúng tôi
        </h2>
        <div className="row g-4">
          {[
            { name: 'Nguyễn Văn A', comment: 'Thức uống tuyệt vời nhất mà tôi từng thử!', rating: 5 },
            { name: 'Trần Thị B', comment: 'Nguyên liệu sạch, hương vị đặc biệt.', rating: 5 },
            { name: 'Lê Văn C', comment: 'Phục vụ chuyên nghiệp, không gian thoải mái.', rating: 4 }
          ].map((testimonial, index) => (
            <div 
              key={index} 
              className="col-md-4" 
              data-aos="flip-left" 
              data-aos-delay={index * 150}
            >
              <div 
                className="card shadow border-0 h-100 p-4" 
                style={{ 
                  transition: 'all 0.3s ease',
                  borderRadius: '15px',
                  background: 'rgba(255, 248, 230, 0.5)'
                }}
              >
                <div className="d-flex justify-content-between mb-3">
                  <h5 className="card-title">{testimonial.name}</h5>
                  <div>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-warning">★</span>
                    ))}
                  </div>
                </div>
                <p className="card-text fst-italic">"{testimonial.comment}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Liên hệ với gradient background */}
      <footer 
        className="text-white py-4 text-center"
        style={{
          background: 'linear-gradient(45deg, #1a1a1a, #343a40)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            background: 'radial-gradient(circle, transparent 20%, black 70%)',
            opacity: 0.4
          }}
        />
        <h3 className="text-warning position-relative" data-aos="fade-up">Liên hệ với chúng tôi</h3>
        <div className="container position-relative">
          {[
            { icon: '✉️', text: 'Email: contact@prdrink.com' }, 
            { icon: '📞', text: 'Điện thoại: 0123 456 789' }, 
            { icon: '🏠', text: 'Địa chỉ: 123 Đường ABC, Quận XYZ, TP. HCM' }
          ].map((contact, index) => (
            <p 
              key={index} 
              className="mt-3" 
              data-aos="fade-up" 
              data-aos-delay={index * 100}
            >
              <span className="fs-5 me-2">{contact.icon}</span> {contact.text}
            </p>
          ))}
          <div className="mt-4" data-aos="fade-up" data-aos-delay="200">
            {[
              { icon: '📘', label: 'Facebook' }, 
              { icon: '📸', label: 'Instagram' }, 
              { icon: '▶️', label: 'YouTube' }
            ].map((social, index) => (
              <a 
                key={index} 
                href="#" 
                className="btn btn-outline-light mx-2 rounded-circle"
                style={{ 
                  transition: 'all 0.3s ease',
                  width: '50px',
                  height: '50px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="mt-4" data-aos="fade-up" data-aos-delay="400">
            © {new Date().getFullYear()} PRDrink. Tất cả các quyền được bảo lưu.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;