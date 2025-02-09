import { format } from 'date-fns';
import '../styles/ReservationCard.scss';

export interface Reservation {
  id: string;
  storeId: string;
  storeName: string;
  storeImage: string;
  quantity: number;
  totalAmount: number;
  originalAmount: number;
  status: string;
  paymentId: string;
  pickupTime?: string;
  createdAt: string;
}

interface ReservationCardProps {
  reservation: Reservation;
}

export default function ReservationCard({ reservation }: ReservationCardProps) {
  console.log(reservation);
  return (
    <div className="reservation-card">
      <div className="reservation-card__image-container">
        <img src={reservation.storeImage} alt={reservation.storeName} className="reservation-card__image" />
      </div>
      <div className="reservation-card__content">
        <div className="reservation-card__header">
          <h3 className="reservation-card__title">{reservation.storeName}</h3>
          <span className={`reservation-card__status reservation-card__status--${reservation.status.toLowerCase()}`}>
            {reservation.status}
          </span>
        </div>
        <div className="reservation-card__details">
          <div className="reservation-card__detail">
            <span className="reservation-card__label">Quantity:</span>
            <span className="reservation-card__value">{reservation.quantity}</span>
          </div>
          <div className="reservation-card__detail">
            <span className="reservation-card__label">Price:</span>
            <div className="reservation-card__price-container">
              {reservation.originalAmount !== undefined && (
                <span className="reservation-card__price-original">
                  ${reservation.originalAmount.toFixed(2)}
                </span>
              )}
              {reservation.totalAmount !== undefined && (
                <span className="reservation-card__price-discounted">
                  ${reservation.totalAmount.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          {reservation.pickupTime && (
            <div className="reservation-card__detail">
              <span className="reservation-card__label">Pickup Time:</span>
              <span className="reservation-card__value">{format(new Date(reservation.pickupTime), 'MMM d, h:mm a')}</span>
            </div>
          )}
          <div className="reservation-card__detail">
            <span className="reservation-card__label">Reserved on:</span>
            <span className="reservation-card__value">{format(new Date(reservation.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 