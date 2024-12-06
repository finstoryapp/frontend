"use client";
import "./layout.css";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <div className="content">{children}</div>
        <nav className="navbar">
          <Link href="/" className={pathname === "/" ? "active" : ""}>
            <img
              src={
                pathname === "/" ? "/icons/home_active.svg" : "/icons/home.svg"
              }
              alt="Домашняя"
            />
            Домашняя
          </Link>
          <Link
            href="/accounts"
            className={pathname === "/accounts" ? "active" : ""}
          >
            <img
              src={
                pathname === "/accounts"
                  ? "/icons/accounts_active.svg"
                  : "/icons/accounts.svg"
              }
              alt="Счета"
            />
            Счета
          </Link>
          <Link
            href="/statistics"
            className={pathname === "/statistics" ? "active" : ""}
          >
            <img
              src={
                pathname === "/statistics"
                  ? "/icons/statistics_active.svg"
                  : "/icons/statistics.svg"
              }
              alt="Статистика"
            />
            Статистика
          </Link>
          <Link
            href="/settings"
            className={pathname === "/settings" ? "active" : ""}
          >
            <img
              src={
                pathname === "/settings"
                  ? "/icons/settings_active.svg"
                  : "/icons/settings.svg"
              }
              alt="Настройки"
            />
            Настройки
          </Link>
        </nav>
      </body>
    </html>
  );
}
