import Navbar from "@/components/Navbar/Navbar";
import Providers from "@/components/Providers/Providers";
import "./global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          {children}
          <Navbar />
        </Providers>
      </body>
    </html>
  );
}
