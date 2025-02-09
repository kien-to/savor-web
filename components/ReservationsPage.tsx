'use client';

import { useEffect, useState } from 'react';
import ReservationCard, { Reservation } from './ReservationCard';
import '../styles/ReservationsPage.scss';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/reservations/demo', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }

        const data = await response.json();
        setReservations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) {
    return (
      <div className="reservations-page">
        <div className="reservations-page__loading">Loading reservations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reservations-page">
        <div className="reservations-page__error">{error}</div>
      </div>
    );
  }

  return (
    <div className="reservations-page">
      <h1 className="reservations-page__title">My Reservations</h1>
      {reservations.length === 0 ? (
        <div className="reservations-page__empty">
          You don&apos;t have any reservations yet.
        </div>
      ) : (
        <div className="reservations-page__list">
          {reservations.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))}
        </div>
      )}
    </div>
  );
} 