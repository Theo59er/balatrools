import { Balatro } from "@/lib/gamedata";

export default function Joker({ joker }: { joker: string }) {
    const jokerObj = Balatro.Joker[joker as keyof typeof Balatro.Joker];

    return (<div className="flex flex-row gap-2 max-w-[300px]">
        {/* é is for séance */}
        <img
            loading="lazy"
            src={`/jokers/${jokerObj.name.replaceAll(" ", "_").replace("é", "_")}.webp`}
            className="h-full"
        />
        <div className="flex flex-col gap-2">
            <h3>{jokerObj.name}</h3>
            <p className="text-sm font-thin" dangerouslySetInnerHTML={{ __html: jokerObj.description }} />
        </div>
    </div>);
}
