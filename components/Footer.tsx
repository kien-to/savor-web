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
                className="footer__social-link footer__social-link--facebook"
                aria-label="Facebook"
              >
                <svg className="footer__social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
              <a 
                href="https://instagram.com/savor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer__social-link footer__social-link--instagram"
                aria-label="Instagram"
              >
                <svg className="footer__social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
              <a 
                href="https://zalo.me/savor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer__social-link footer__social-link--zalo"
                aria-label="Zalo"
              >
                <div className="footer__social-icon footer__social-icon--zalo">
                  Z
                </div>
                Zalo
              </a>
              <a 
                href="https://tiktok.com/@savor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer__social-link footer__social-link--tiktok"
                aria-label="TikTok"
              >
                <svg className="footer__social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
                TikTok
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
