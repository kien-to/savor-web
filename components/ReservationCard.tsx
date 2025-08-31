import { format, isPast } from 'date-fns';
import { config } from '../config/environment';
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
  onDelete: (id: string) => void;
}

export default function ReservationCard({ reservation, onDelete }: ReservationCardProps) {
  console.log(reservation);

  // Function to safely format date
  const formatPickupTime = (pickupTime: string | null) => {
    if (!pickupTime) return 'Chưa xác định';
    
    try {
      const date = new Date(pickupTime);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return pickupTime; // Return original string if not a valid date
      }
      return format(date, 'd MMM, HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return pickupTime; // Fallback to original string
    }
  };

  // Check if reservation is expired
  const isExpired = () => {
    if (!reservation.pickupTime) return false;
    try {
      const pickupDate = new Date(reservation.pickupTime);
      return isPast(pickupDate);
    } catch {
      return false;
    }
  };

  // Don't render if reservation is expired
  if (isExpired()) {
    return null;
  }

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn đặt hàng này?')) {
      try {
        const response = await fetch(`${config.apiUrl}/api/reservations/${reservation.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Không thể hủy đơn đặt hàng');
        }

        onDelete(reservation.id);
      } catch (error) {
        console.error('Error deleting reservation:', error);
        alert('Không thể hủy đơn đặt hàng. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="reservation-card">
      <div className="reservation-card__image-container">
        <img src={reservation.storeImage} alt={reservation.storeName} className="reservation-card__image" />
      </div>
      <div className="reservation-card__content">
        <div className="reservation-card__header">
          <h3 className="reservation-card__title">{reservation.storeName}</h3>
          <div className="reservation-card__status-container">
            <span className={`reservation-card__status reservation-card__status--${reservation.status.toLowerCase()}`}>
              {reservation.status}
            </span>
            <button 
              className="reservation-card__delete-button" 
              onClick={handleDelete}
              aria-label="Xóa đơn đặt hàng"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="reservation-card__details">
          <div className="reservation-card__detail">
            <span className="reservation-card__label">Số lượng:</span>
            <span className="reservation-card__value">{reservation.quantity}</span>
          </div>
          <div className="reservation-card__detail">
            <span className="reservation-card__label">Giá:</span>
            <div className="reservation-card__price-container">
              {reservation.originalAmount !== undefined && (
                <span className="reservation-card__price-original">
                  {reservation.originalAmount.toFixed(2)}k đ
                </span>
              )}
              {reservation.totalAmount !== undefined && (
                <span className="reservation-card__price-discounted">
                  {reservation.totalAmount.toFixed(2)}k đ
                </span>
              )}
            </div>
          </div>
          {reservation.pickupTime && (
            <div className="reservation-card__detail">
              <span className="reservation-card__label">Thời gian nhận hàng:</span>
              <span className="reservation-card__value">
                {formatPickupTime(reservation.pickupTime)}
              </span>
            </div>
          )}
          <div className="reservation-card__detail">
            <span className="reservation-card__label">Đặt hàng lúc:</span>
            <span className="reservation-card__value">{format(new Date(reservation.createdAt), 'd MMM, yyyy')}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 