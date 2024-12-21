"use client";

import "./globals.css";
import "./layout.css";

import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { StoreProvider } from "@/store/StoreProvider";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <StoreProvider>
      <html lang="en">
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
        </head>
        <body>
          <Providers>
            <header>
              <span>Finstor</span>
              <span>y</span>
            </header>
            <div className="content">{children}</div>
            <nav className="navbar">
              <Link href="/" className={pathname === "/" ? "active" : ""}>
                <Image
                  src={
                    pathname === "/"
                      ? "/icons/home_active.svg"
                      : "/icons/home.svg"
                  }
                  alt="Домашняя"
                  width={24}
                  height={24}
                  priority={false}
                />
                Домашняя
              </Link>
              <Link
                href="/accounts"
                className={pathname === "/accounts" ? "active" : ""}
              >
                <Image
                  src={
                    pathname === "/accounts"
                      ? "/icons/accounts_active.svg"
                      : "/icons/accounts.svg"
                  }
                  alt="Счета"
                  width={24}
                  height={24}
                  priority={false}
                />
                Счета
              </Link>
              <Link
                href="/statistics"
                className={pathname === "/statistics" ? "active" : ""}
              >
                <Image
                  src={
                    pathname === "/statistics"
                      ? "/icons/statistics_active.svg"
                      : "/icons/statistics.svg"
                  }
                  alt="Статистика"
                  width={24}
                  height={24}
                  priority={false}
                />
                Статистика
              </Link>
              <Link
                href="/settings"
                className={pathname === "/settings" ? "active" : ""}
              >
                <Image
                  src={
                    pathname === "/settings"
                      ? "/icons/settings_active.svg"
                      : "/icons/settings.svg"
                  }
                  alt="Настройки"
                  width={24}
                  height={24}
                  priority={false}
                />
                Настройки
              </Link>
            </nav>
          </Providers>
        </body>
      </html>
    </StoreProvider>
  );
}
