'use client';

import { useEffect, useState } from 'react';
import ReservationCard, { Reservation } from './ReservationCard';
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
      let response = await fetch('http://localhost:8080/api/reservations', {
        credentials: 'include',
      });

      // If unauthorized, try to fetch session reservations
      if (response.status === 401) {
        response = await fetch('http://localhost:8080/api/reservations/session', {
          credentials: 'include',
        });
      }

      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }

      const data = await response.json();
      // Handle both array response and object with reservations property
      const reservationsList = Array.isArray(data) ? data : (data.reservations || []);
      setReservations(reservationsList);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to load reservations');
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
    return <div className="reservations-page__loading">Loading...</div>;
  }

  if (error) {
    return <div className="reservations-page__error">{error}</div>;
  }

  if (reservations.length === 0) {
    return (
      <div className="reservations-page__empty">
        <h2>No reservations found</h2>
        <p>Your reservations will appear here once you make them.</p>
      </div>
    );
  }

  return (
    <div className="reservations-page">
      <h1 className="reservations-page__title">Your Reservations</h1>
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