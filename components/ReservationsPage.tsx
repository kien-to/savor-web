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
    console.log('[RESERVATIONS-PAGE] 📄 Component mounted, fetching reservations...');
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      console.log('[RESERVATIONS-PAGE] 🔄 Starting reservation fetch...');
      console.log('[RESERVATIONS-PAGE] Timestamp:', new Date().toISOString());
      
      // First, try to get reservations from localStorage
      console.log('[RESERVATIONS-PAGE] Checking localStorage...');
      const localReservations = localStorage.getItem('savor_reservations');
      
      if (localReservations) {
        console.log('[RESERVATIONS-PAGE] Found reservations in localStorage');
        const parsedReservations = JSON.parse(localReservations);
        console.log('[RESERVATIONS-PAGE] localStorage reservations:', parsedReservations);
        
        // Filter out expired reservations
        // const currentTime = new Date();
        // const activeReservations = parsedReservations.filter((res: Reservation) => {
        //   if (!res.pickupTime) return true;
        //   try {
        //     const pickupDate = new Date(res.pickupTime);
        //     return pickupDate.getTime() > currentTime.getTime();
        //   } catch {
        //     return true; // Keep if can't parse date
        //   }
        // });

        const activeReservations = parsedReservations;
        
        console.log('[RESERVATIONS-PAGE] Active reservations from localStorage:', activeReservations);
        setReservations(activeReservations);
        setLoading(false);
        return;
      }
      
      console.log('[RESERVATIONS-PAGE] No localStorage reservations found, trying API...');
      console.log('[RESERVATIONS-PAGE] API URL:', getEndpointUrl('reservations'));
      console.log('[RESERVATIONS-PAGE] Current cookies:', document.cookie);
      
      // Fallback to API if no localStorage data
      let response = await fetch(getEndpointUrl('reservations'), {
        credentials: 'include',
      });

      console.log('[RESERVATIONS-PAGE] First response status:', response.status);

      // If unauthorized, try to fetch session reservations
      if (response.status === 401) {
        console.log('[RESERVATIONS-PAGE] Unauthorized, trying session endpoint...');
        console.log('[RESERVATIONS-PAGE] Session API URL:', getEndpointUrl('reservationsSession'));
        response = await fetch(getEndpointUrl('reservationsSession'), {
          credentials: 'include',
        });
        console.log('[RESERVATIONS-PAGE] Session response status:', response.status);
      }

      if (!response.ok) {
        console.error('[RESERVATIONS-PAGE] Response not OK:', response.status, response.statusText);
        throw new Error('Không thể tải danh sách đơn đặt hàng');
      }

      const data = await response.json();
      console.log('[RESERVATIONS-PAGE] Raw API response:', data);
      console.log('[RESERVATIONS-PAGE] Response type:', typeof data);
      console.log('[RESERVATIONS-PAGE] Is array?:', Array.isArray(data));
      
      // Handle both array response and object with reservations property
      const reservationsList = Array.isArray(data) ? data : (data.reservations || []);
      console.log('[RESERVATIONS-PAGE] Processed reservations list:', reservationsList);
      console.log('[RESERVATIONS-PAGE] Reservations count:', reservationsList.length);
      setReservations(reservationsList);
    } catch (err) {
      console.error('[RESERVATIONS-PAGE] Error fetching reservations:', err);
      setError('Không thể tải danh sách đơn đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    console.log('[RESERVATIONS-PAGE] Deleting reservation:', id);
    
    // Update the UI immediately
    const updatedReservations = reservations.filter(reservation => reservation.id !== id);
    setReservations(updatedReservations);
    
    // Update localStorage
    localStorage.setItem('savor_reservations', JSON.stringify(updatedReservations));
    console.log('[RESERVATIONS-PAGE] Reservation removed from localStorage');
    
    // Also try to delete from server (fire and forget)
    fetch(`${getEndpointUrl('reservations')}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    }).catch(err => {
      console.warn('[RESERVATIONS-PAGE] Failed to delete from server:', err);
    });
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