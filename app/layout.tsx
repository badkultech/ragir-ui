import { Poppins, Barlow } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "Ragir - Organizer Dashboard",
  description: "Travel organizer dashboard for managing trips and analytics",
};

const barlow = Barlow({
  variable: "--font-barlow",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const poppins = Poppins({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${barlow.variable}`}>
      <body className="font-poppins antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
