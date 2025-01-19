import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Balatro Save Editor | Balatrools",
    description: "Simple save editor for Balatro .jkr files to change whatever you want. Save a run, cheat, or un-break your game.",
}

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (<>{children}</>);
}