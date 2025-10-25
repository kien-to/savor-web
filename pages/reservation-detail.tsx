import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/ReservationDetail.module.scss';

interface ReservationDetailProps {
  reservationId: string;
  storeName: string;
  storeImage: string;
  storeAddress: string;
  customerName: string;
  customerEmail: string;
  phoneNumber: string;
  quantity: number;
  totalAmount: number;
  status: string;
  pickupTime: string;
  createdAt: string;
  paymentType: string;
}

const ReservationDetail = () => {
  const router = useRouter();
  const [reservation, setReservation] = useState<ReservationDetailProps | null>(null);

  useEffect(() => {
    if (router.isReady) {
      const {
        reservationId,
        storeName,
        storeImage,
        storeAddress,
        customerName,
        customerEmail,
        phoneNumber,
        quantity,
        totalAmount,
        status,
        pickupTime,
        createdAt,
        paymentType,
      } = router.query;

      setReservation({
        reservationId: reservationId as string,
        storeName: storeName as string,
        storeImage: storeImage as string,
        storeAddress: storeAddress as string,
        customerName: customerName as string,
        customerEmail: customerEmail as string,
        phoneNumber: phoneNumber as string,
        quantity: Number(quantity),
        totalAmount: Number(totalAmount),
        status: status as string,
        pickupTime: pickupTime as string,
        createdAt: createdAt as string,
        paymentType: paymentType as string,
      });
    }
  }, [router.isReady, router.query]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'picked_up':
        return '#2196F3';
      case 'confirmed':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang chờ';
      case 'picked_up':
        return 'Đã lấy';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  if (!reservation) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Đang tải...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Chi tiết đơn hàng - Savor</title>
      </Head>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <button 
            className={styles.backButton}
            onClick={() => router.back()}
          >
            ← Quay lại
          </button>
          <h1 className={styles.headerTitle}>Chi tiết đơn hàng</h1>
          <div className={styles.headerSpacer} />
        </div>

        <div className={styles.content}>
          {/* Store Information */}
          <div className={styles.storeCard}>
            {reservation.storeImage && (
              <img
                src={reservation.storeImage}
                alt={reservation.storeName}
                className={styles.storeImage}
              />
            )}
            <div className={styles.storeInfo}>
              <h2 className={styles.storeName}>{reservation.storeName}</h2>
              <p className={styles.storeAddress}>{reservation.storeAddress}</p>
            </div>
          </div>

          {/* Order Status */}
          <div className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <h3 className={styles.statusTitle}>Trạng thái đơn hàng</h3>
              <span 
                className={styles.statusBadge}
                style={{ backgroundColor: getStatusColor(reservation.status) }}
              >
                {getStatusText(reservation.status)}
              </span>
            </div>
          </div>

          {/* Order Details */}
          <div className={styles.detailsCard}>
            <h3 className={styles.cardTitle}>Thông tin đơn hàng</h3>
            
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Mã đơn hàng:</span>
              <span className={styles.detailValue}>{reservation.reservationId}</span>
            </div>
            
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Số lượng:</span>
              <span className={styles.detailValue}>{reservation.quantity} túi</span>
            </div>
            
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Tổng tiền:</span>
              <span className={styles.detailValue}>{reservation.totalAmount.toFixed(0)}.000đ</span>
            </div>
            
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Phương thức thanh toán:</span>
              <span className={styles.detailValue}>{reservation.paymentType || 'Trả tiền tại cửa hàng'}</span>
            </div>
            
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Thời gian đặt:</span>
              <span className={styles.detailValue}>{formatDate(reservation.createdAt)}</span>
            </div>
          </div>

          {/* Pickup Information */}
          <div className={styles.detailsCard}>
            <h3 className={styles.cardTitle}>Thông tin nhận hàng</h3>
            
            <div className={styles.pickupTimeContainer}>
              <span className={styles.pickupIcon}>🕐</span>
              <span className={styles.pickupTimeText}>{reservation.pickupTime}</span>
            </div>
            
            <div className={styles.pickupLocationContainer}>
              <span className={styles.pickupIcon}>📍</span>
              <span className={styles.pickupLocationText}>{reservation.storeAddress}</span>
            </div>
          </div>

          {/* Customer Information */}
          <div className={styles.detailsCard}>
            <h3 className={styles.cardTitle}>Thông tin khách hàng</h3>
            
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Họ tên:</span>
              <span className={styles.detailValue}>{reservation.customerName}</span>
            </div>
            
            {reservation.customerEmail && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Email:</span>
                <span className={styles.detailValue}>{reservation.customerEmail}</span>
              </div>
            )}
            
            {reservation.phoneNumber && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Số điện thoại:</span>
                <span className={styles.detailValue}>{reservation.phoneNumber}</span>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className={styles.instructionsCard}>
            <span className={styles.instructionsIcon}>ℹ️</span>
            <p className={styles.instructionsText}>
              Vui lòng đến cửa hàng đúng giờ để nhận hàng. Mang theo mã đơn hàng để xác nhận.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservationDetail;
