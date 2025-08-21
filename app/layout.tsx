import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.scss";
import "../styles/Navigation.scss";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Savor - Giảm thiểu lãng phí thực phẩm",
  description: "Tìm và đặt mua túi đồ ăn bất ngờ từ các cửa hàng địa phương",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <nav className="nav">
          <div className="nav__container">
            <Link href="/" className="nav__logo">
              SAVOR
            </Link>
            <div className="nav__menu">
              <Link href="/reservations">Đơn đặt hàng</Link>
              <Link href="/profile">Tài khoản</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
} 