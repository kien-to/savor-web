import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.scss";
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
        <nav className="bg-red-500 text-white">
          <div className="container-custom">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="font-bold text-xl">
                SAVOR
              </Link>
              <div className="flex space-x-4">
                <Link href="/" className="hover:text-red-200">
                  Home
                </Link>
                <Link href="/profile" className="hover:text-red-200">
                  Profile
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="container-custom py-8">
          {children}
        </main>
      </body>
    </html>
  );
} 