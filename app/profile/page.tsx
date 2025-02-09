'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/Profile.scss';

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      // TODO: Implement logout logic
      console.log('Logging out...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-page__header">
        <div className="profile-page__user-info">
          <img
            src="https://avatars.githubusercontent.com/u/84117554?v=4"
            alt="Profile"
            className="profile-page__avatar"
          />
          <div className="profile-page__user-details">
            <h1 className="profile-page__name">John Doe</h1>
            <p className="profile-page__email">john@example.com</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="profile-page__actions">
        <button className="profile-page__action-btn" onClick={() => router.push('/settings')}>
          <span className="profile-page__action-icon">⚙️</span>
          <span>Settings</span>
        </button>
        <button className="profile-page__action-btn" onClick={() => router.push('/help')}>
          <span className="profile-page__action-icon">❓</span>
          <span>Help Center</span>
        </button>
        <button className="profile-page__action-btn" onClick={() => router.push('/about')}>
          <span className="profile-page__action-icon">ℹ️</span>
          <span>About Us</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="profile-page__stats">
        <div className="profile-page__stat-card">
          <h3 className="profile-page__stat-value">24</h3>
          <p className="profile-page__stat-label">Orders Made</p>
        </div>
        <div className="profile-page__stat-card">
          <h3 className="profile-page__stat-value">$128.50</h3>
          <p className="profile-page__stat-label">Money Saved</p>
        </div>
        <div className="profile-page__stat-card">
          <h3 className="profile-page__stat-value">12kg</h3>
          <p className="profile-page__stat-label">CO₂ Saved</p>
        </div>
      </div>

      {/* Logout Button */}
      <button 
        className="profile-page__logout-btn"
        onClick={handleLogout}
        disabled={loading}
      >
        {loading ? 'Logging out...' : 'Log Out'}
      </button>

      {/* Version */}
      <p className="profile-page__version">Version 24.11.0</p>
    </div>
  );
} 