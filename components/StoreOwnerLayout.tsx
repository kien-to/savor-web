'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStoreOwner } from '../src/context/StoreOwnerContext';
import { storeOwnerApiService, StoreOwnerReservation, StoreOwnerSettings } from '../src/services/storeOwnerApi';
import '../styles/StoreOwnerLayout.scss';

// interface StoreReservation {
//   id: string;
//   customerName: string;
//   quantity: number;
//   totalAmount: number;
//   pickupTime: string;
//   status: 'active' | 'picked_up';
//   createdAt: string;
// }

interface StoreOwnerLayoutProps {
  children: React.ReactNode;
}

export default function StoreOwnerLayout({ children }: StoreOwnerLayoutProps) {
  const { isStoreOwnerMode, toggleStoreOwnerMode, hasStore } = useStoreOwner();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'reservations' | 'settings'>('reservations');
  const [currentReservations, setCurrentReservations] = useState<StoreOwnerReservation[]>([]);
  const [pastReservations, setPastReservations] = useState<StoreOwnerReservation[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreOwnerSettings>({
    surpriseBoxes: 10,
    price: 16,
    isSelling: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isStoreOwnerMode && hasStore) {
      loadReservations();
      loadSettings();
    }
  }, [isStoreOwnerMode, hasStore]);

  const loadReservations = async () => {
    try {
      setIsLoading(true);
      const data = await storeOwnerApiService.getReservations();
      setCurrentReservations(data.currentReservations);
      setPastReservations(data.pastReservations);
    } catch (error) {
      console.error('Error loading reservations:', error);
      alert('Không thể tải danh sách đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await storeOwnerApiService.getSettings();
      setStoreSettings(settings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleMarkAsPickedUp = async (reservationId: string, customerName: string) => {
    if (confirm(`Đánh dấu đơn hàng của ${customerName} là đã lấy?`)) {
      try {
        await storeOwnerApiService.updateReservationStatus(reservationId, 'picked_up');
        // Update both current and past reservations
        setCurrentReservations(prev => 
          prev.map(res => 
            res.id === reservationId 
              ? { ...res, status: 'picked_up' as const }
              : res
          )
        );
        setPastReservations(prev => 
          prev.map(res => 
            res.id === reservationId 
              ? { ...res, status: 'picked_up' as const }
              : res
          )
        );
        alert('Đã đánh dấu đơn hàng là đã lấy');
      } catch (error) {
        console.error('Error updating reservation status:', error);
        alert('Không thể cập nhật trạng thái đơn hàng');
      }
    }
  };

  const handleUpdateSettings = async (newSettings: Partial<StoreOwnerSettings>) => {
    try {
      const updatedSettings = { ...storeSettings, ...newSettings };
      await storeOwnerApiService.updateSettings(updatedSettings);
      setStoreSettings(updatedSettings);
      alert('Đã cập nhật cài đặt cửa hàng');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Không thể cập nhật cài đặt');
    }
  };

  // If store owner mode is enabled, show the store owner interface
  if (isStoreOwnerMode && hasStore) {
    return (
      <div className="store-owner-layout">
        {/* Store Owner Header */}
        <div className="store-owner-layout__header">
          <h1 className="store-owner-layout__title">Chế độ chủ cửa hàng</h1>
          <button
            className="store-owner-layout__exit-button"
            onClick={toggleStoreOwnerMode}
          >
            ✕
          </button>
        </div>

        {/* Store Owner Content */}
        <div className="store-owner-layout__content">
          {activeTab === 'reservations' ? (
            <div className="store-owner-layout__tab-content">
              <div className="store-owner-layout__tab-header">
                <h2 className="store-owner-layout__tab-title">Đơn đặt hàng</h2>
                <button className="store-owner-layout__refresh-button">🔄</button>
              </div>
              
              <div className="store-owner-layout__reservations-list">
                {isLoading ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    Đang tải đơn hàng...
                  </div>
                ) : (
                  <>
                    {/* Current Reservations */}
                    <h3 className="store-owner-layout__section-title">
                      Đơn hàng hiện tại ({currentReservations.length})
                    </h3>
                    {currentReservations.map((reservation) => (
                  <div 
                    key={reservation.id} 
                    className="store-owner-layout__reservation-card"
                    onClick={() => {
                      router.push({
                        pathname: '/reservation-detail',
                        query: {
                          reservationId: reservation.id,
                          storeName: reservation.storeName,
                          storeImage: reservation.storeImage,
                          storeAddress: reservation.storeAddress,
                          customerName: reservation.customerName,
                          customerEmail: reservation.customerEmail || '',
                          phoneNumber: reservation.phoneNumber || '',
                          quantity: reservation.quantity.toString(),
                          totalAmount: reservation.totalAmount.toString(),
                          status: reservation.status,
                          pickupTime: reservation.pickupTime || 'Chưa lên lịch',
                          createdAt: reservation.createdAt,
                          paymentType: 'Trả tiền tại cửa hàng',
                        },
                      });
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="store-owner-layout__reservation-header">
                      <span className="store-owner-layout__customer-name">{reservation.customerName}</span>
                        <span className={`store-owner-layout__status-badge store-owner-layout__status-badge--${reservation.status}`}>
                          {reservation.status === 'active' ? 'Đang chờ' : 'Đã lấy'}
                        </span>
                    </div>
                    <p className="store-owner-layout__reservation-details">
                      Số lượng: {reservation.quantity} • {reservation.totalAmount.toFixed(0)}.000đ
                    </p>
                    <p className="store-owner-layout__pickup-time">
                      Lấy hàng: {reservation.pickupTime ? new Date(reservation.pickupTime).toLocaleString() : 'Chưa xác định'}
                    </p>
                    {reservation.status === 'active' && (
                      <button
                        className="store-owner-layout__pickup-button"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card navigation
                          handleMarkAsPickedUp(reservation.id, reservation.customerName);
                        }}
                      >
                        ✓ Đánh dấu đã lấy
                      </button>
                    )}
                  </div>
                ))}

                    {/* Past Reservations */}
                    <h3 className="store-owner-layout__section-title" style={{ marginTop: '2rem' }}>
                      Đơn hàng đã qua ({pastReservations.length})
                    </h3>
                    {pastReservations.map((reservation) => (
                      <div 
                        key={reservation.id} 
                        className="store-owner-layout__reservation-card" 
                        style={{ opacity: 0.7, cursor: 'pointer' }}
                        onClick={() => {
                          router.push({
                            pathname: '/reservation-detail',
                            query: {
                              reservationId: reservation.id,
                              storeName: 'Store', // Store owner view - we don't have store name in reservation
                              storeImage: '', // Store owner view - we don't have store image
                              storeAddress: '', // Store owner view - we don't have store address
                              customerName: reservation.customerName,
                              customerEmail: reservation.customerEmail || '',
                              phoneNumber: reservation.phoneNumber || '',
                              quantity: reservation.quantity.toString(),
                              totalAmount: reservation.totalAmount.toString(),
                              status: reservation.status,
                              pickupTime: reservation.pickupTime || 'Chưa lên lịch',
                              createdAt: reservation.createdAt,
                              paymentType: 'Trả tiền tại cửa hàng',
                            },
                          });
                        }}
                      >
                        <div className="store-owner-layout__reservation-header">
                          <span className="store-owner-layout__customer-name">{reservation.customerName}</span>
                          <span className={`store-owner-layout__status-badge store-owner-layout__status-badge--${reservation.status}`}>
                            {reservation.status === 'active' ? 'Đang chờ' : 'Đã lấy'}
                          </span>
                        </div>
                        <p className="store-owner-layout__reservation-details">
                          Số lượng: {reservation.quantity} • {reservation.totalAmount.toFixed(0)}.000đ
                        </p>
                        <p className="store-owner-layout__pickup-time">
                          Lấy hàng: {reservation.pickupTime || 'Chưa xác định'}
                        </p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="store-owner-layout__tab-content">
              <h2 className="store-owner-layout__tab-title">Cài đặt cửa hàng</h2>
              <div className="store-owner-layout__setting-item">
                <label className="store-owner-layout__setting-label">Số túi đồ ăn bất ngờ</label>
                <div className="store-owner-layout__setting-value">
                  <button 
                    className="store-owner-layout__value-button"
                    onClick={() => handleUpdateSettings({ surpriseBoxes: Math.max(1, storeSettings.surpriseBoxes - 1) })}
                  >-</button>
                  <span className="store-owner-layout__value-text">{storeSettings.surpriseBoxes}</span>
                  <button 
                    className="store-owner-layout__value-button"
                    onClick={() => handleUpdateSettings({ surpriseBoxes: storeSettings.surpriseBoxes + 1 })}
                  >+</button>
                </div>
              </div>
              <div className="store-owner-layout__setting-item">
                <label className="store-owner-layout__setting-label">Giá mỗi túi</label>
                <div className="store-owner-layout__setting-value">
                  <button 
                    className="store-owner-layout__value-button"
                    onClick={() => handleUpdateSettings({ price: Math.max(1, storeSettings.price - 1) })}
                  >-</button>
                  <span className="store-owner-layout__value-text">{storeSettings.price.toFixed(0)}.000đ</span>
                  <button 
                    className="store-owner-layout__value-button"
                    onClick={() => handleUpdateSettings({ price: storeSettings.price + 1 })}
                  >+</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Store Owner Bottom Tabs */}
        <div className="store-owner-layout__bottom-tabs">
          <button
            className={`store-owner-layout__bottom-tab ${activeTab === 'reservations' ? 'store-owner-layout__bottom-tab--active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            <span className="store-owner-layout__bottom-tab-icon">📋</span>
            <span className="store-owner-layout__bottom-tab-text">Đơn hàng</span>
          </button>
          <button
            className={`store-owner-layout__bottom-tab ${activeTab === 'settings' ? 'store-owner-layout__bottom-tab--active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="store-owner-layout__bottom-tab-icon">⚙️</span>
            <span className="store-owner-layout__bottom-tab-text">Cài đặt</span>
          </button>
        </div>
      </div>
    );
  }

  // Normal customer interface
  return <>{children}</>;
}
