import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Balatro Save Editor | Balatrools",
    description: "Simple save editor for Balatro .jkr files to change whatever you want. Save a run, cheat, or un-break your game!",
    keywords: ["balatro", "save", "editor", "jkr", "cheat", "balatro save editor", "balatrools"],
    openGraph: {
        title: "Balatro Save Editor | Balatrools",
        description: "Simple save editor for Balatro .jkr files to change whatever you want. Save a run, cheat, or un-break your game!",
        url: "https://balatrools.pages.dev/editor",
        siteName: "Balatrools",
        images: [
            {
                url: "https://balatrools.pages.dev/jimbo.jpg",
            },
        ],
    },
}

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (<>{children}</>);
}