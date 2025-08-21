'use client';

import { useEffect, useState } from 'react';
import { HomePageData, Store } from '../types';
import { getHomePageData } from '../utils/api';
import Link from 'next/link';
import StoreCard from './StoreCard';
import '../styles/HomePage.scss';

const HANOI_DISTRICTS = [
  { name: 'Ba Đình', coordinates: { lat: 21.0337, lng: 105.8140 } },
  { name: 'Hoàn Kiếm', coordinates: { lat: 21.0287, lng: 105.8514 } },
  { name: 'Tây Hồ', coordinates: { lat: 21.0811, lng: 105.8185 } },
  { name: 'Long Biên', coordinates: { lat: 21.0381, lng: 105.8865 } },
  { name: 'Cầu Giấy', coordinates: { lat: 21.0359, lng: 105.7946 } },
  { name: 'Đống Đa', coordinates: { lat: 21.0180, lng: 105.8298 } },
  { name: 'Hai Bà Trưng', coordinates: { lat: 21.0088, lng: 105.8619 } },
  { name: 'Hoàng Mai', coordinates: { lat: 20.9762, lng: 105.8544 } },
  { name: 'Thanh Xuân', coordinates: { lat: 20.9961, lng: 105.8087 } },
];

const PAYMENT_METHODS = [
  { id: 'cash', name: 'Tiền mặt (Thanh toán trước)', icon: '💵' },
  // { id: 'card', name: 'Thẻ tín dụng', icon: '💳' },
  // { id: 'bank', name: 'Chuyển khoản ngân hàng', icon: '🏦' },
  // { id: 'zalopay', name: 'ZaloPay', icon: '📱' },
  // { id: 'momo', name: 'Momo', icon: '💜' },
];

export default function HomePage() {
  const [homeData, setHomeData] = useState<HomePageData | null>(null);
  const [filteredHomeData, setFilteredHomeData] = useState<HomePageData | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [guestInfoErrors, setGuestInfoErrors] = useState({
    name: '',
    contact: '',
  });
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHODS[0]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        console.log('[HomePage] Starting fetchInitialData...');
        setLoading(true);
        // Use a fixed location for initial render
        const defaultDistrict = HANOI_DISTRICTS.find(d => d.name === 'Hoàn Kiếm');
        console.log('[HomePage] Default district selected:', defaultDistrict);
        
        if (defaultDistrict) {
          console.log('[HomePage] Calling getHomePageData with coordinates:', {
            lat: defaultDistrict.coordinates.lat,
            lng: defaultDistrict.coordinates.lng
          });
          
          const data = await getHomePageData(
            defaultDistrict.coordinates.lat,
            defaultDistrict.coordinates.lng
          );
          
          console.log('[HomePage] getHomePageData successful, data:', data);
          setHomeData(data);
          setFilteredHomeData(data);
        } else {
          console.error('[HomePage] Default district not found');
          setError('Default location not found');
        }
      } catch (err) {
        console.error('[HomePage] fetchInitialData error:', err);
        console.error('[HomePage] Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined,
          name: err instanceof Error ? err.name : undefined
        });
        setError('Failed to fetch home data');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const getCurrentLocation = () => {
    if (typeof window === 'undefined') return; // Guard clause for SSR

    console.log('[HomePage] getCurrentLocation called');
    setLocationLoading(true);
    if (!navigator.geolocation) {
      console.error('[HomePage] Geolocation not supported');
      alert('Trình duyệt của bạn không hỗ trợ định vị địa lý');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          console.log('[HomePage] Geolocation successful:', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          
          const data = await getHomePageData(
            position.coords.latitude,
            position.coords.longitude
          );
          
          console.log('[HomePage] Current location data fetch successful:', data);
          setHomeData(data);
          setFilteredHomeData(data);
        } catch (err) {
          console.error('[HomePage] getCurrentLocation API error:', err);
          console.error('[HomePage] Current location error details:', {
            message: err instanceof Error ? err.message : 'Unknown error',
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
          setError('Không thể lấy dữ liệu cho vị trí của bạn');
        } finally {
          setLocationLoading(false);
        }
      },
      (error: GeolocationPositionError) => {
        console.error('[HomePage] Geolocation error:', error);
        console.error('[HomePage] Geolocation error details:', {
          code: error.code,
          message: error.message,
          PERMISSION_DENIED: error.PERMISSION_DENIED,
          POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
          TIMEOUT: error.TIMEOUT
        });
        alert('Không thể lấy vị trí của bạn. Vui lòng chọn quận/huyện.');
        setLocationLoading(false);
      }
    );
  };

  useEffect(() => {
    if (!homeData) {
      setFilteredHomeData(null);
      return;
    }

    if (!searchText.trim()) {
      setFilteredHomeData(homeData);
      return;
    }

    const searchLower = searchText.toLowerCase().trim();
    
    const filteredRecommended = homeData.recommendedStores.filter(store =>
      store.title.toLowerCase().includes(searchLower) ||
      (store.description?.toLowerCase() || '').includes(searchLower)
    );

    const filteredPickUpTomorrow = homeData.pickUpTomorrow.filter(store =>
      store.title.toLowerCase().includes(searchLower) ||
      (store.description?.toLowerCase() || '').includes(searchLower)
    );

    setFilteredHomeData({
      ...homeData,
      recommendedStores: filteredRecommended,
      pickUpTomorrow: filteredPickUpTomorrow,
    });
  }, [searchText, homeData]);

  const handleReserve = (store: Store) => {
    setSelectedStore(store);
    setShowPaymentModal(true);
  };

  const validateGuestInfo = () => {
    const errors = {
      name: '',
      contact: '',
    };
    let isValid = true;

    if (!guestInfo.name.trim()) {
      errors.name = 'Vui lòng nhập họ tên';
      isValid = false;
    }

    if (!guestInfo.email && !guestInfo.phone) {
      errors.contact = 'Vui lòng nhập email hoặc số điện thoại';
      isValid = false;
    }

    setGuestInfoErrors(errors);
    return isValid;
  };

  const handlePaymentSubmit = async (method: string) => {
    if (!validateGuestInfo()) {
      return;
    }

    try {
      setLoading(true);
      
      if (!selectedStore) {
        throw new Error('Chưa chọn cửa hàng');
      }

      const reservationData = {
        storeId: selectedStore.id,
        storeName: selectedStore.title,
        storeImage: selectedStore.imageUrl,
        quantity: 1,
        totalAmount: selectedStore.discountedPrice || selectedStore.price,
        pickupTime: selectedStore.pickUpTime,
        name: guestInfo.name,
        email: guestInfo.email,
        phone: guestInfo.phone,
        paymentType: method
      };

      // Make API call to create reservation
      const response = await fetch('https://savor-server-production.up.railway.app/api/reservations/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for session handling
        body: JSON.stringify(reservationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Không thể tạo đơn đặt hàng');
      }

      setShowPaymentModal(false);
      // Reset guest info after successful reservation
      setGuestInfo({
        name: '',
        email: '',
        phone: '',
      });

      // Show success message
      alert('Đặt hàng thành công! Đang chuyển hướng đến trang đơn hàng...');

      // Redirect to reservations page
      window.location.href = '/reservations';
    } catch (err) {
      console.error('Error processing reservation:', err);
      alert(err instanceof Error ? err.message : 'Không thể xử lý đơn đặt hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodSelect = (method: typeof PAYMENT_METHODS[0]) => {
    console.log('Selected payment method:', method);
    setSelectedPaymentMethod(method);
    setShowPaymentMethodModal(false);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading__spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        {error}
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-page__header">
        <div className="home-page__header-location">
          <div className="home-page__location-selector">
            <button 
              className="home-page__location-btn"
              // onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            //   >
            //     <span>📍</span>
            //     <span>{selectedLocation}</span>
            //     <span className="home-page__location-arrow">▼</span>
            //   </button>
            //   {showLocationDropdown && (
            //     <div className="home-page__location-dropdown">
            //       <button 
            //         className="home-page__location-option home-page__location-option--current"
            //         onClick={getCurrentLocation}
            //         disabled={locationLoading}
            //       >
            //         {locationLoading ? 'Getting location...' : '📱 Use current location'}
            //       </button>
            //       <div className="home-page__location-divider" />
            //       {HANOI_DISTRICTS.map((district) => (
            //         <button
            //           key={district.name}
            //           className="home-page__location-option"
            //           onClick={() => handleLocationSelect(district)}
            //         >
            //           {district.name}
            //         </button>
            //       ))}
            //     </div>
            //   )}
            // </div>
            // <p className="home-page__header-distance">
            //   within {homeData?.userLocation?.distance || 0} mi
            // </p>
              onClick={getCurrentLocation}
              disabled={locationLoading}
            >
              <span>📍</span>
              <span>Vị trí hiện tại</span>
              {/* <span>{locationLoading ? 'Đang lấy vị trí...' : selectedLocation}</span> */}
              {/* {locationLoading && <span className="home-page__location-loading">⏳</span>} */}
            </button>
          </div>
          {/* <p className="home-page__header-distance">
            trong bán kính {homeData?.userLocation?.distance || 0} km
          </p> */}
        </div>
      </div>

      <div className="home-page__search">
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <span className="home-page__search-icon">🔍</span>
      </div>

      {searchText.trim().length > 0 && 
       filteredHomeData?.recommendedStores.length === 0 && 
       filteredHomeData?.pickUpTomorrow.length === 0 && (
        <div className="home-page__no-results">
          Không tìm thấy cửa hàng nào phù hợp với &quot;{searchText}&quot;
        </div>
      )}

      <main>
        <section className="home-page__section">
          <div className="home-page__section-header">
            <h2>Đề xuất cho bạn</h2>
            <Link href="/stores/recommended">Xem tất cả</Link>
          </div>
          <div className="home-page__section-scroll">
            <button 
              className="home-page__section-scroll-button home-page__section-scroll-button--left"
              onClick={() => {
                const container = document.getElementById('recommended-scroll');
                if (container) {
                  container.scrollBy({ left: -280, behavior: 'smooth' });
                }
              }}
            >
              ←
            </button>
            <div 
              id="recommended-scroll"
              className="home-page__section-scroll-container"
            >
              {filteredHomeData?.recommendedStores.map(store => (
                <StoreCard key={store.id} store={store} onReserve={handleReserve} />
              ))}
            </div>
            <button 
              className="home-page__section-scroll-button home-page__section-scroll-button--right"
              onClick={() => {
                const container = document.getElementById('recommended-scroll');
                if (container) {
                  container.scrollBy({ left: 280, behavior: 'smooth' });
                }
              }}
            >
              →
            </button>
          </div>
        </section>

        <section className="home-page__section">
          <div className="home-page__section-header">
            <h2>Nhận hàng ngày mai</h2>
            <Link href="/stores/tomorrow">Xem tất cả</Link>
          </div>
          <div className="home-page__section-scroll">
            <button 
              className="home-page__section-scroll-button home-page__section-scroll-button--left"
              onClick={() => {
                const container = document.getElementById('tomorrow-scroll');
                if (container) {
                  container.scrollBy({ left: -280, behavior: 'smooth' });
                }
              }}
            >
              ←
            </button>
            <div 
              id="tomorrow-scroll"
              className="home-page__section-scroll-container"
            >
              {filteredHomeData?.pickUpTomorrow.map(store => (
                <StoreCard key={store.id} store={store} onReserve={handleReserve} />
              ))}
            </div>
            <button 
              className="home-page__section-scroll-button home-page__section-scroll-button--right"
              onClick={() => {
                const container = document.getElementById('tomorrow-scroll');
                if (container) {
                  container.scrollBy({ left: 280, behavior: 'smooth' });
                }
              }}
            >
              →
            </button>
          </div>
        </section>
      </main>

      {showPaymentModal && selectedStore && (
        <div className="payment-modal">
          <div className="payment-modal__content">
            <div className="payment-modal__header">
              <div className="payment-modal__header-inner">
                <button onClick={() => setShowPaymentModal(false)}>✕</button>
                <h2>{selectedStore.title}</h2>
                <div></div>
              </div>
              <p className="payment-modal__header-pickup">
                {selectedStore.pickUpTime}
              </p>
            </div>

            <div className="payment-modal__body">
              <div className="payment-modal__guest-info">
                <h3>THÔNG TIN CỦA BẠN</h3>
                <div className="payment-modal__form">
                  <div className="payment-modal__form-group">
                    <label htmlFor="name">Họ tên *</label>
                    <input
                      type="text"
                      id="name"
                      value={guestInfo.name}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Họ và tên của bạn"
                    />
                    {guestInfoErrors.name && (
                      <span className="payment-modal__error">{guestInfoErrors.name}</span>
                    )}
                  </div>
                  <div className="payment-modal__form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={guestInfo.email}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@cuaban.com"
                    />
                  </div>
                  <div className="payment-modal__form-group">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                      type="tel"
                      id="phone"
                      value={guestInfo.phone}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+84 123 456 789"
                    />
                  </div>
                  {guestInfoErrors.contact && (
                    <span className="payment-modal__error">{guestInfoErrors.contact}</span>
                  )}
                  
                  <button 
                    className="payment-modal__method-selector"
                    type="button"
                    onClick={() => {
                      console.log('Opening payment method modal');
                      setShowPaymentMethodModal(true);
                    }}
                  >
                    <div className="payment-modal__method-info">
                      <span>{selectedPaymentMethod.icon}</span>
                      <span>{selectedPaymentMethod.name}</span>
                    </div>
                    <span>Thay đổi</span>
                  </button>
                </div>
              </div>

              <div className="payment-modal__summary">
                <div className="summary-row">
                  <span>Giá gốc</span>
                  <span className="payment-modal__price-original">
                    ${selectedStore?.originalPrice?.toFixed(2) || selectedStore?.price?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Giảm giá</span>
                  <span className="payment-modal__price-discount">
                    -${((selectedStore?.originalPrice || selectedStore?.price || 0) - 
                       (selectedStore?.discountedPrice || selectedStore?.price || 0)).toFixed(2)}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Thuế</span>
                  <span>$0.00</span>
                </div>
                <div className="summary-row total-row">
                  <span>Tổng cộng</span>
                  <span>
                    ${selectedStore?.discountedPrice?.toFixed(2) || selectedStore?.price?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>

              <button 
                className="payment-modal__pay-button"
                onClick={() => handlePaymentSubmit(selectedPaymentMethod.id)}
                disabled={loading}
              >
                Thanh toán ${selectedStore?.discountedPrice?.toFixed(2) || selectedStore?.price?.toFixed(2) || '0.00'}
              </button>

              <p className="payment-modal__terms">
                Bằng việc đặt món này, bạn đồng ý với Điều khoản và Điều kiện.
              </p>
            </div>
          </div>
        </div>
      )}

      {showPaymentMethodModal && (
        <div className="payment-method-modal">
          <div className="payment-method-modal__content">
            <div className="payment-method-modal__header">
              <h3>Chọn phương thức thanh toán</h3>
              <button onClick={() => setShowPaymentMethodModal(false)}>✕</button>
            </div>
            <div className="payment-method-modal__body">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  className={`payment-method-modal__option ${
                    method.id === selectedPaymentMethod.id ? 'payment-method-modal__option--selected' : ''
                  }`}
                  onClick={() => handlePaymentMethodSelect(method)}
                >
                  <div className="payment-method-modal__option-info">
                    <span>{method.icon}</span>
                    <span>{method.name}</span>
                  </div>
                  {method.id === selectedPaymentMethod.id && (
                    <span className="payment-method-modal__check">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 