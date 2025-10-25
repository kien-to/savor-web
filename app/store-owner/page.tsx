'use client';

import { useState, useEffect } from 'react';
import { useStoreOwner } from '../../src/context/StoreOwnerContext';
import '../../styles/StoreOwner.scss';

interface StoreReservation {
  id: string;
  customerName: string;
  quantity: number;
  totalAmount: number;
  pickupTime: string;
  status: 'active' | 'picked_up';
  createdAt: string;
}

export default function StoreOwnerPage() {
  const { isStoreOwnerMode, toggleStoreOwnerMode, hasStore, storeInfo, isLoading } = useStoreOwner();
  const [activeTab, setActiveTab] = useState<'reservations' | 'settings'>('reservations');
  const [reservations, setReservations] = useState<StoreReservation[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [storeSettings, setStoreSettings] = useState({
    surpriseBoxes: 10,
    price: 15.99,
    address: '',
    images: [] as string[],
  });

  useEffect(() => {
    if (hasStore && storeInfo) {
      setStoreSettings(prev => ({
        ...prev,
        address: storeInfo.address,
      }));
    }
  }, [hasStore, storeInfo]);

  const fetchStoreReservations = async () => {
    if (!hasStore) return;
    
    setReservationsLoading(true);
    try {
      // TODO: Implement API call to fetch store reservations
      // For now, using mock data
      const mockReservations: StoreReservation[] = [
        {
          id: '1',
          customerName: 'John Doe',
          quantity: 2,
          totalAmount: 31.98,
          pickupTime: '2024-01-15T14:00:00Z',
          status: 'active',
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          customerName: 'Jane Smith',
          quantity: 1,
          totalAmount: 15.99,
          pickupTime: '2024-01-15T16:00:00Z',
          status: 'active',
          createdAt: '2024-01-15T11:30:00Z',
        },
        {
          id: '3',
          customerName: 'Mike Johnson',
          quantity: 3,
          totalAmount: 47.97,
          pickupTime: '2024-01-15T12:00:00Z',
          status: 'picked_up',
          createdAt: '2024-01-15T09:00:00Z',
        },
      ];
      setReservations(mockReservations);
    } catch (error) {
      console.error('Error fetching store reservations:', error);
      alert('Failed to load reservations');
    } finally {
      setReservationsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'reservations' && hasStore) {
      fetchStoreReservations();
    }
  }, [activeTab, hasStore]);

  const handleSignUpStore = () => {
    // TODO: Navigate to store signup page
    alert('Store signup functionality will be implemented');
  };

  const handleMarkAsPickedUp = (reservationId: string, customerName: string) => {
    if (confirm(`Mark ${customerName}'s order as picked up?`)) {
      setReservations(prev => 
        prev.map(res => 
          res.id === reservationId 
            ? { ...res, status: 'picked_up' as const }
            : res
        )
      );
      alert('Order marked as picked up');
    }
  };

  const renderNoStorePrompt = () => (
    <div className="store-owner__no-store">
      <div className="store-owner__no-store-icon">🏪</div>
      <h2 className="store-owner__no-store-title">No Store Found</h2>
      <p className="store-owner__no-store-description">
        You don't have a store registered yet. Sign up to start managing your store and reservations.
      </p>
      <button className="store-owner__signup-button" onClick={handleSignUpStore}>
        Sign Up Store
      </button>
    </div>
  );

  const renderReservationsTab = () => (
    <div className="store-owner__tab-content">
      <div className="store-owner__tab-header">
        <h3 className="store-owner__tab-title">Today's Reservations</h3>
        <button className="store-owner__refresh-button" onClick={fetchStoreReservations}>
          🔄
        </button>
      </div>
      
      {reservationsLoading ? (
        <div className="store-owner__loading">Loading...</div>
      ) : reservations.length === 0 ? (
        <div className="store-owner__empty-state">
          <div className="store-owner__empty-icon">📋</div>
          <p className="store-owner__empty-text">No reservations for today</p>
        </div>
      ) : (
        <div className="store-owner__reservations-list">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="store-owner__reservation-card">
              <div className="store-owner__reservation-header">
                <span className="store-owner__customer-name">{reservation.customerName}</span>
                <span className={`store-owner__status-badge store-owner__status-badge--${reservation.status}`}>
                  {reservation.status === 'active' ? 'Active' : 'Picked Up'}
                </span>
              </div>
              <p className="store-owner__reservation-details">
                Quantity: {reservation.quantity} • ${reservation.totalAmount.toFixed(2)}
              </p>
              <p className="store-owner__pickup-time">
                Pickup: {new Date(reservation.pickupTime).toLocaleString()}
              </p>
              {reservation.status === 'active' && (
                <button
                  className="store-owner__pickup-button"
                  onClick={() => handleMarkAsPickedUp(reservation.id, reservation.customerName)}
                >
                  ✓ Mark as Picked Up
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div className="store-owner__tab-content">
      <h3 className="store-owner__tab-title">Store Configuration</h3>
      
      {/* Store Owner Mode Toggle */}
      <div className="store-owner__toggle-container">
        <div className="store-owner__toggle-info">
          <h3 className="store-owner__toggle-label">Store Owner Mode</h3>
          <p className="store-owner__toggle-description">Manage your store and reservations</p>
        </div>
        <label className="store-owner__switch">
          <input
            type="checkbox"
            checked={isStoreOwnerMode}
            onChange={toggleStoreOwnerMode}
          />
          <span className="store-owner__slider"></span>
        </label>
      </div>
      
      <div className="store-owner__setting-item">
        <label className="store-owner__setting-label">Number of Surprise Boxes</label>
        <div className="store-owner__setting-value">
          <button
            className="store-owner__value-button"
            onClick={() => setStoreSettings(prev => ({ ...prev, surpriseBoxes: Math.max(1, prev.surpriseBoxes - 1) }))}
          >
            -
          </button>
          <span className="store-owner__value-text">{storeSettings.surpriseBoxes}</span>
          <button
            className="store-owner__value-button"
            onClick={() => setStoreSettings(prev => ({ ...prev, surpriseBoxes: prev.surpriseBoxes + 1 }))}
          >
            +
          </button>
        </div>
      </div>

      <div className="store-owner__setting-item">
        <label className="store-owner__setting-label">Price per Box</label>
        <div className="store-owner__setting-value">
          <button
            className="store-owner__value-button"
            onClick={() => setStoreSettings(prev => ({ ...prev, price: Math.max(0.01, prev.price - 0.50) }))}
          >
            -
          </button>
          <span className="store-owner__value-text">${storeSettings.price.toFixed(2)}</span>
          <button
            className="store-owner__value-button"
            onClick={() => setStoreSettings(prev => ({ ...prev, price: prev.price + 0.50 }))}
          >
            +
          </button>
        </div>
      </div>

      <div className="store-owner__setting-item">
        <label className="store-owner__setting-label">Store Address</label>
        <div className="store-owner__address-text">
          {storeSettings.address || 'No address set'}
        </div>
      </div>

      <button className="store-owner__save-button">
        Save Changes
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="store-owner">
        <div className="store-owner__loading-container">
          <div className="store-owner__loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (!hasStore) {
    return (
      <div className="store-owner">
        <div className="store-owner__header">
          <h1 className="store-owner__header-title">Store Owner Mode</h1>
        </div>
        {renderNoStorePrompt()}
      </div>
    );
  }

  return (
    <div className="store-owner">
      {/* Full Screen Tab Content */}
      <div className="store-owner__full-screen-content">
        {activeTab === 'reservations' ? renderReservationsTab() : renderSettingsTab()}
      </div>

      {/* Bottom Tab Navigation */}
      <div className="store-owner__bottom-tab-container">
        <button
          className={`store-owner__bottom-tab ${activeTab === 'reservations' ? 'store-owner__bottom-tab--active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          <span className="store-owner__bottom-tab-icon">📋</span>
          <span className="store-owner__bottom-tab-text">Reservations</span>
        </button>
        <button
          className={`store-owner__bottom-tab ${activeTab === 'settings' ? 'store-owner__bottom-tab--active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <span className="store-owner__bottom-tab-icon">⚙️</span>
          <span className="store-owner__bottom-tab-text">Settings</span>
        </button>
      </div>
    </div>
  );
}
