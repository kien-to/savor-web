'use client';

import Link from 'next/link';
import '../styles/Footer.scss';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          {/* Brand Section */}
          <div className="footer__brand">
            <h3 className="footer__logo">SAVOR</h3>
            <p className="footer__description">
              Giảm thiểu lãng phí thực phẩm và tạo ra giá trị từ những món ăn thừa. 
              Kết nối cửa hàng với khách hàng để xây dựng cộng đồng bền vững và tiết kiệm.
            </p>
            <div className="footer__mission">
              <p>🌱 Bảo vệ môi trường • 💰 Tiết kiệm chi phí • 🤝 Kết nối cộng đồng</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="footer__contact">
            <h4>Liên hệ</h4>
            <div className="footer__contact-item">
              <span className="footer__contact-icon">📞</span>
              <a href="tel:0964928175" className="footer__contact-link">
                0964928175
              </a>
            </div>
            <div className="footer__contact-item">
              <span className="footer__contact-icon">✉️</span>
              <a href="mailto:kientrungto95@gmail.com" className="footer__contact-link">
                kientrungto95@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__links">
            <h4>Liên kết nhanh</h4>
            <div className="footer__nav">
              <Link href="/" className="footer__nav-link">Trang chủ</Link>
              <Link href="/reservations" className="footer__nav-link">Đơn đặt hàng</Link>
              <Link href="/partner" className="footer__nav-link">Cửa hàng/Đối tác</Link>
            </div>
          </div>

          {/* Social Media */}
          <div className="footer__social">
            <h4>Theo dõi chúng tôi</h4>
            <div className="footer__social-links">
              <a 
                href="https://facebook.com/savor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Facebook"
              >
                <span className="footer__social-icon">📘</span>
                Facebook
              </a>
              <a 
                href="https://instagram.com/savor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Instagram"
              >
                <span className="footer__social-icon">📷</span>
                Instagram
              </a>
              <a 
                href="https://zalo.me/savor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Zalo"
              >
                <span className="footer__social-icon">💬</span>
                Zalo
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p className="footer__copyright">
              © {new Date().getFullYear()} Savor. Tất cả quyền được bảo lưu.
            </p>
            <div className="footer__bottom-links">
              <a href="#" className="footer__bottom-link">Điều khoản sử dụng</a>
              <span className="footer__divider">•</span>
              <a href="#" className="footer__bottom-link">Chính sách bảo mật</a>
              <span className="footer__divider">•</span>
              <a href="#" className="footer__bottom-link">Hỗ trợ</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
