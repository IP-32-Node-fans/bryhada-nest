import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer";

import { Montserrat, Pacifico } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pacifico',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "IP 32 NODE FANS",
  description: "IP 32 NODE FANS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${pacifico.variable} flex flex-col min-h-screen w-full`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
