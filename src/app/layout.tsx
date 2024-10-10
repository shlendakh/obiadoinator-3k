import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar/page";
import { Open_Sans } from "next/font/google";
import AuthProvider from "./context/AuthProvider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/options";

const roboto = Open_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Obiadoinator 3K",
  description: "App for your daily shopping and recepies",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch session server-side
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={roboto.className}>
      <body className="antialiased">
        {/* Pass the session to the AuthProvider */}
        <AuthProvider session={session}>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
