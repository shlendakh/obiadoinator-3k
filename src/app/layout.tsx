import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar/page";
import { Open_Sans } from "next/font/google";

const roboto = Open_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Obiadoinator 3K",
  description: "App for your daily shopping and recepies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.className}>
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
