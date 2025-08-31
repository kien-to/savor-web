'use client';

import { useEffect, useState } from 'react';
import ReservationCard, { Reservation } from './ReservationCard';
import { getEndpointUrl } from '../config/environment';
import '../styles/ReservationsPage.scss';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      // Try to fetch authenticated user reservations first
      let response = await fetch(getEndpointUrl('reservations'), {
        credentials: 'include',
      });

      // If unauthorized, try to fetch session reservations
      if (response.status === 401) {
        response = await fetch(getEndpointUrl('reservationsSession'), {
          credentials: 'include',
        });
      }

      if (!response.ok) {
        throw new Error('Không thể tải danh sách đơn đặt hàng');
      }

      const data = await response.json();
      // Handle both array response and object with reservations property
      const reservationsList = Array.isArray(data) ? data : (data.reservations || []);
      setReservations(reservationsList);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Không thể tải danh sách đơn đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    // Update the UI immediately
    setReservations(prevReservations => 
      prevReservations.filter(reservation => reservation.id !== id)
    );
  };

  if (loading) {
    return <div className="reservations-page__loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="reservations-page__error">{error}</div>;
  }

  if (reservations.length === 0) {
    return (
      <div className="reservations-page__empty">
        <h2>Không tìm thấy đơn đặt hàng nào</h2>
        <p>Đơn đặt hàng của bạn sẽ xuất hiện ở đây sau khi bạn đặt hàng.</p>
      </div>
    );
  }

  return (
    <div className="reservations-page">
      <h1 className="reservations-page__title">Đơn đặt hàng của bạn</h1>
      <div className="reservations-page__list">
        {reservations.map(reservation => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
} 