import { Balatro } from "@/lib/gamedata";
import EditorInput from "./EditorInput";
import Joker from "./Joker";
import Info from "./Info";
import Input from "./Input";
import { ProfileData } from "@/types/profile";

export default function JokerEntry({ jokerKey, profile, setProfile, stake }: { stake: number, jokerKey: string; profile: ProfileData; setProfile: (settings: ProfileData) => void }) {
    const jokerName = Balatro.Joker[jokerKey as keyof typeof Balatro.Joker].name;

    function updateWinsLosses(wins: number, losses: number) {
        const newWins = profile.joker_usage[jokerKey as keyof typeof Balatro.Joker]!.wins;
        const newLosses = profile.joker_usage[jokerKey as keyof typeof Balatro.Joker]!.losses;
        newWins[stake] = wins;
        newLosses[stake] = losses;
        setProfile({
            ...profile,
            joker_usage: {
                ...profile.joker_usage,
                [jokerKey]: {
                    count: profile.joker_usage[jokerKey as keyof typeof Balatro.Joker]!.count,
                    wins: newWins,
                    losses: newLosses,
                }
            }
        });
    }
    
    return (<>
        <div className="flex flex-row gap-2 items-center">
            <Info info={<Joker joker={jokerKey} />}><h3>{jokerName}</h3></Info>
            <EditorInput type="number" placeholder="Times Used" setting={`joker_usage.${jokerKey}.count`} settings={profile} setSettings={setProfile} />
            {/* <Input type="number" placeholder="Wins" value={usageData?.wins[stake] ?? 0} onChange={e => usageData && updateWinsLosses(parseInt(e.target.value), usageData.losses[stake])} /> */}
            {/* <Input type="number" placeholder="Losses" value={usageData?.losses[stake] ?? 0} onChange={e => usageData && updateWinsLosses(usageData.wins[stake], parseInt(e.target.value))} /> */}
        </div>
    </>);
}