import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.scss";
import "../styles/Navigation.scss";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Savor - Reduce Food Waste",
  description: "Find and reserve surprise bags from local stores",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="nav">
          <div className="nav__container">
            <Link href="/" className="nav__logo">
              SAVOR
            </Link>
            <div className="nav__menu">
              <Link href="/reservations">Reservations</Link>
              <Link href="/profile">Profile</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
} 