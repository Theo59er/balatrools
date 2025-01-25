import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Balatro Jokers Library | Balatrools",
    description: "Every joker in Balatro.",
}

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (<>{children}</>);
}