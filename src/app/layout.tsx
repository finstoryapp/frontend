import Navbar from "@/components/Navbar/Navbar";
import Providers from "@/components/Providers/Providers";
import "@/styles/global.css";
import styles from "@/styles/layout.module.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <header className={styles.header}>
            <span>Finstor</span>
            <span>y</span>
          </header>
          {children}
          <Navbar />
        </Providers>
      </body>
    </html>
  );
}
