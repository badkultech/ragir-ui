import { Poppins, Barlow } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ReduxProvider } from "@/lib/redux-provider";
import HydratedAuth from "@/components/AuthLoader";
import { Toaster } from "@/components/ui/toaster";

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
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins antialiased ">
        <ReduxProvider>
          <HydratedAuth>
            {children}
            <Toaster />
          </HydratedAuth>
        </ReduxProvider>
      </body>
    </html>
  );
}
