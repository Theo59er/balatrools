import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import Head from "next/head";

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
      <head>
        <GoogleTagManager gtmId="G-Q6P1J19EDF" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
