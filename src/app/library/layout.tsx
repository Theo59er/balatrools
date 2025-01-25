import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Balatro Library | Balatrools",
    description: "A Balatro library for all the jokers, consumables, and everything else you need to know.",
}

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (<>{children}</>);
}