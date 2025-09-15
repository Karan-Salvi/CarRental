import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import Footer from "@/components/footer";
import State_Provider from "@/components/State_Provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "RentCarsWorld - Luxury Cars on Rent",
  description: "Find and book the perfect luxury rental car for any occasion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="font-body antialiased bg-background text-foreground flex flex-col min-h-screen">
        <State_Provider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </State_Provider>
      </body>
    </html>
  );
}
