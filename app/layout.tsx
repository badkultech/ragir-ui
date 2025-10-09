import { Poppins } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ReduxProvider } from "@/lib/redux-provider";
import HydratedAuth from "@/components/AuthLoader";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Ragir - Organizer Dashboard",
  description: "Travel organizer dashboard for managing trips and analytics",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins antialiased">
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
