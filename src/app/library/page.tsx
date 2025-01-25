import Link from "next/link";

function LibraryButton({ icon, children, href }: { icon: string; children: React.ReactNode; href?: string }) {
    return (<Link className="flex flex-col w-full justify-between items-center bg-bg-3 hover:bg-bg-4 hover:!text-white !text-white px-4 py-2 rounded-lg shadow" href={"/library/" + href}>
        <div className="h-full flex items-center"><img src={icon} /></div>
        {children}
    </Link>);
}

export default function LibraryPage() {
    return (<div className="absolute-center h-full p-5 py-10 lg:w-[50%] md:w-[75%] flex flex-col gap-2">
        <h1>Balatro Library</h1>
        <div className="flex flex-row gap-2">
            <LibraryButton icon="/jokers/joker.webp" href="jokers">Jokers</LibraryButton>
            <LibraryButton icon="/stakes/Gold_stake.webp" href="stakes">Stakes</LibraryButton>
        </div>
    </div>)
}