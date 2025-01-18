import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

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
      <GoogleAnalytics gaId="G-Q6P1J19EDF" />
    </html>
  );
}
