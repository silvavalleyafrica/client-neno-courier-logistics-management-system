import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neno Courier | Operations",
  description: "Neno Courier logistics and delivery operations platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
