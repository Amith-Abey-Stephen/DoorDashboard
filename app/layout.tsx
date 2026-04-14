import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "Inovus Smart Door",
    template: "%s | Inovus Smart Door",
  },
  description:
    "Inovus Smart Door — Real-time RFID access control system with live monitoring, card management, and Discord notifications.",
  keywords: [
    "smart door",
    "RFID",
    "access control",
    "IoT",
    "Firebase",
    "real-time",
  ],
  openGraph: {
    title: "Inovus Smart Door",
    description: "Real-time RFID access control system with live monitoring.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
