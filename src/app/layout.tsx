import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
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
      <Head>
        <GoogleAnalytics gaId="G-Q6P1J19EDF" />
      </Head>
      <body>
        {children}
      </body>
    </html>
  );
}
