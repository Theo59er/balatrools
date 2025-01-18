import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Balatrools",
  description: "Tools and resources for Balatro",
  icons: [
    {
      url: "/jimbo.jpg",
    },
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
