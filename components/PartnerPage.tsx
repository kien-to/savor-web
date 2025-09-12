'use client';

import { useState } from 'react';
import '../styles/PartnerPage.scss';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  storeName: string;
  message: string;
}

const PartnerPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    storeName: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/partner/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          storeName: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="partner-page">
      <div className="partner-page__container">
        <div className="partner-page__header">
          <h1>Cửa hàng/Đối tác</h1>
          <p className="partner-page__subtitle">
            Hợp tác cùng Savor để giảm thiểu lãng phí thực phẩm và tăng doanh thu cho cửa hàng của bạn
          </p>
        </div>

        <div className="partner-page__content">
          <div className="partner-page__options">
            <h2>Chọn cách tham gia</h2>
            
            <div className="option-cards">
              <div className="option-card primary">
                <h3>🚀 Đăng ký trực tiếp</h3>
                <p>Bắt đầu ngay lập tức với cửa hàng của bạn</p>
                <a 
                  href="https://docs.google.com/forms/d/e/1FAIpQLScRmhk8JMsbmhpkIz-6j-TW47BMBspwFnZD1AngXu84_oVNCA/viewform?usp=dialog" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="cta-button primary"
                >
                  Đăng ký ngay
                </a>
              </div>
              
              <div className="option-card secondary">
                <h3>💬 Tư vấn và hỏi đáp</h3>
                <p>Có câu hỏi? Cần tư vấn thêm? Liên hệ với chúng tôi</p>
                <button 
                  className="cta-button secondary"
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Liên hệ tư vấn
                </button>
              </div>
            </div>
          </div>

          <div className="partner-page__info">
            <h2>Tại sao hợp tác với Savor?</h2>
            <div className="benefits">
              <div className="benefit-item">
                <h3>🌱 Giảm lãng phí thực phẩm</h3>
                <p>Biến những món ăn thừa thành cơ hội kinh doanh</p>
              </div>
              <div className="benefit-item">
                <h3>💰 Tăng doanh thu</h3>
                <p>Thu thêm doanh thu từ những sản phẩm sắp hết hạn</p>
              </div>
              <div className="benefit-item">
                <h3>🤝 Mở rộng khách hàng</h3>
                <p>Tiếp cận thêm nhiều khách hàng mới thông qua ứng dụng</p>
              </div>
              <div className="benefit-item">
                <h3>🌍 Bảo vệ môi trường</h3>
                <p>Góp phần xây dựng cộng đồng bền vững</p>
              </div>
            </div>

            <div className="contact-info">
              <h3>Liên hệ trực tiếp</h3>
              <div className="contact-details">
                <p><strong>📞 Số điện thoại:</strong> <a href="tel:0964928175">0964928175</a></p>
                <p><strong>✉️ Email:</strong> <a href="mailto:kientrungto95@gmail.com">kientrungto95@gmail.com</a></p>
              </div>
            </div>
          </div>

          <div className="partner-page__form" id="contact-form">
            <h2>Liên hệ tư vấn</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Họ và tên *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="example@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="0123456789"
                />
              </div>

              <div className="form-group">
                <label htmlFor="storeName">Tên cửa hàng *</label>
                <input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập tên cửa hàng của bạn"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Tin nhắn (tùy chọn)</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Chia sẻ thêm về cửa hàng của bạn hoặc câu hỏi bạn muốn hỏi..."
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi đăng ký'}
              </button>

              {submitStatus === 'success' && (
                <div className="success-message">
                  ✅ Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="error-message">
                  ❌ Có lỗi xảy ra khi gửi đăng ký. Vui lòng thử lại hoặc liên hệ trực tiếp.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerPage;
