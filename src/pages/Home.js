import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'animate.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <div style={styles.container}>
      {/* Banner with animation */}
      <header style={styles.banner}>
        <div style={styles.overlay}></div>
        <div style={styles.bannerContent} className="animate__animated animate__fadeIn animate__delay-1s">
          <h1 style={styles.title} className="animate__animated animate__zoomIn">PRDrink - Thức uống hiện đại</h1>
          <p style={styles.subtitle} className="animate__animated animate__fadeInUp animate__delay-1s">Trải nghiệm những hương vị tuyệt vời nhất</p>
          <Link to="/products" style={styles.button} className="animate__animated animate__pulse animate__infinite animate__slower">
            Khám phá ngay
          </Link>
        </div>
      </header>

      {/* Danh mục sản phẩm with scroll effects */}
      <section style={styles.section}>
        <h2 style={styles.heading} data-aos="fade-up">Danh mục nổi bật</h2>
        <div style={styles.productList}>
          {[
            { name: 'Cà phê', image: '/image/coffe.jpg' },
            { name: 'Trà', image: '/image/tea.jpg' },
            { name: 'Sinh tố', image: '/image/smoothie.jpg' },
            { name: 'Trà sữa', image: '/image/milk_tead.jpg' },
          ].map((product, index) => (
            <div key={index} style={styles.product} data-aos="fade-up" data-aos-delay={`${index * 100}`} className="product-card">
              <div style={styles.imageContainer} className="image-container">
                <img src={product.image} alt={product.name} style={styles.image} />
                <div style={styles.imageOverlay}>
                  <Link to="/products" style={styles.viewButton}>Xem thêm</Link>
                </div>
              </div>
              <p style={styles.productName}>{product.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Giới thiệu with parallax effect */}
      <section style={styles.about} className="parallax">
        <div style={styles.aboutContent} data-aos="fade-up">
          <h2 style={styles.heading}>Về PRDrink</h2>
          <p style={styles.text} data-aos="fade-up" data-aos-delay="200">
            PRDrink mang đến cho bạn những thức uống thơm ngon, chất lượng nhất. Chúng tôi cam kết sử dụng nguyên liệu tươi sạch, đảm bảo sức khỏe và mang lại trải nghiệm tuyệt vời cho khách hàng.
          </p>
          <div style={styles.features} data-aos="fade-up" data-aos-delay="300">
            {[
              { icon: '🌿', title: 'Nguyên liệu sạch' },
              { icon: '⭐', title: 'Chất lượng cao' },
              { icon: '💯', title: 'Hương vị đặc biệt' },
            ].map((feature, index) => (
              <div key={index} style={styles.feature} className="feature">
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3>{feature.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Liên hệ with hover effects */}
      <footer style={styles.footer}>
        <h3 style={styles.footerTitle} data-aos="fade-up">Liên hệ với chúng tôi</h3>
        <div style={styles.contactInfo} data-aos="fade-up" data-aos-delay="100">
          {[
            { icon: '✉️', text: 'Email: contact@prdrink.com' },
            { icon: '📞', text: 'Điện thoại: 0123 456 789' },
            { icon: '🏠', text: 'Địa chỉ: 123 Đường ABC, Quận XYZ, TP. HCM' },
          ].map((contact, index) => (
            <p key={index} style={styles.contactItem} className="contact-item">
              <span style={styles.contactIcon}>{contact.icon}</span> {contact.text}
            </p>
          ))}
        </div>
        <div style={styles.socialIcons} data-aos="fade-up" data-aos-delay="200">
          {['📘', '📸', '▶️'].map((icon, index) => (
            <a key={index} href="#" style={styles.socialIcon} className="social-icon">
              {icon}
            </a>
          ))}
        </div>
      </footer>

      {/* CSS for dynamic effects */}
      <style jsx>{`
        .product-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        
        .image-container:hover .image-overlay {
          opacity: 1;
        }
        
        .contact-item:hover {
          transform: translateX(5px);
          color: #ff6600;
        }
        
        .social-icon:hover {
          transform: scale(1.2);
          background-color: #ff6600;
        }
        
        .parallax {
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          background-image: linear-gradient(rgba(249, 249, 249, 0.9), rgba(249, 249, 249, 0.9)), url('/image/sidebar.jpg');
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .feature:hover {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// CSS bằng JavaScript với các cải tiến hiện đại
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    textAlign: 'center',
    overflow: 'hidden',
  },
  banner: {
    position: 'relative',
    backgroundImage: 'url("/image/banner.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.5s ease',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  bannerContent: {
    position: 'relative',
    color: '#fff',
    textAlign: 'center',
    maxWidth: '800px',
    padding: '0 20px',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  subtitle: {
    fontSize: '22px',
    marginBottom: '30px',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
  },
  button: {
    padding: '15px 30px',
    background: 'linear-gradient(45deg, #ff6600, #ff8c42)',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '30px',
    fontWeight: 'bold',
    transition: '0.3s',
    display: 'inline-block',
    boxShadow: '0 5px 15px rgba(255, 102, 0, 0.4)',
  },
  section: {
    padding: '80px 20px',
  },
  heading: {
    fontSize: '32px',
    marginBottom: '30px',
    fontWeight: 'bold',
    color: '#ff6600',
    position: 'relative',
    display: 'inline-block',
  },
  productList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    justifyContent: 'center',
    padding: '0 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  product: {
    textAlign: 'center',
    borderRadius: '15px',
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    backgroundColor: '#fff',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    padding: '15px',
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '10px',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  viewButton: {
    padding: '10px 20px',
    background: 'linear-gradient(45deg, #ff6600, #ff8c42)',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '30px',
    fontWeight: 'bold',
    transition: '0.3s',
  },
  productName: {
    marginTop: '15px',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  image: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    borderRadius: '10px',
    transition: 'transform 0.5s ease',
  },
  about: {
    padding: '80px 20px',
    textAlign: 'center',
  },
  aboutContent: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  text: {
    maxWidth: '800px',
    margin: '0 auto 40px',
    fontSize: '18px',
    lineHeight: '1.8',
  },
  features: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '30px',
    marginTop: '40px',
  },
  feature: {
    flex: '1 1 250px',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    maxWidth: '300px',
  },
  featureIcon: {
    fontSize: '40px',
    marginBottom: '15px',
  },
  footer: {
    backgroundColor: '#222',
    color: '#fff',
    padding: '60px 20px',
    marginTop: '20px',
    textAlign: 'center',
  },
  footerTitle: {
    fontSize: '24px',
    marginBottom: '20px',
    fontWeight: 'bold',
    color: '#ff6600',
  },
  contactInfo: {
    maxWidth: '600px',
    margin: '0 auto 30px',
  },
  contactItem: {
    margin: '15px 0',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    display: 'inline-block',
  },
  contactIcon: {
    marginRight: '10px',
    fontSize: '20px',
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '30px',
  },
  socialIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#333',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
};

export default Home;