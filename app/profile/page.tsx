'use client';

import { useEffect, useState } from 'react';
import { Reservation } from '../../types';
import { getUserReservations } from '../../utils/api';

export default function Profile() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // TODO: Replace with actual user ID from authentication
        const mockUserId = '123';
        const data = await getUserReservations(mockUserId);
        setReservations(data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-8">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">My Information</h2>
        <div className="space-y-2">
          <p className="text-gray-600">Name: John Doe</p>
          <p className="text-gray-600">Email: john@example.com</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">My Reservations</h2>
        
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="card border border-red-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-red-500">
                    Reservation #{reservation.id}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Pickup: {new Date(reservation.pickupTime).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {reservation.quantity}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  reservation.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : reservation.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : reservation.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                </span>
              </div>
            </div>
          ))}

          {reservations.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              You haven't made any reservations yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 