import { Poppins, Barlow } from "next/font/google";
// import "./globals.css";

// Optimized font loading with display swap for better performance
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap", // Improves loading performance
});

const barlow = Barlow({
  variable: "--font-barlow",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap", // Improves loading performance
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${barlow.variable} ${poppins.variable} antialiased`}>
      {children}
    </div>
  );
}
