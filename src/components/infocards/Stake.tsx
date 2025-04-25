import { Balatro } from "@/lib/gamedata";

export default function Stake({ stake }: { stake: string }) {
    const stakeObj = Balatro.Stake[stake as keyof typeof Balatro.Stake];

    return (<div className="flex flex-row gap-2">
        <img
            loading="lazy"
            src={`stakes/${stakeObj.name.replaceAll(" ", "_")}.webp`}
            className="h-full"
        />
        <div className="flex flex-col gap-2">
            <h3>{stakeObj.name}</h3>
            <p className="text-sm font-thin" dangerouslySetInnerHTML={{ __html: stakeObj.description }} />
        </div>
    </div>);
}
