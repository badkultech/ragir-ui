import { Poppins, Barlow } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/lib/redux-provider";
import HydratedAuth from "@/components/AuthLoader";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from '@vercel/analytics/next';

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
    <html lang="en" className="">
      <body className={`${poppins.variable} ${barlow.variable} font-poppins antialiased`}>
        <ReduxProvider>
          <HydratedAuth>
            {children}
            <Analytics />
            <Toaster />
          </HydratedAuth>
        </ReduxProvider>
      </body>
    </html>
  );
}
