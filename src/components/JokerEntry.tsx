import { Balatro } from "@/lib/gamedata";
import EditorInput from "./EditorInput";
import Joker from "./infocards/Joker";
import Info from "./Info";
import Input from "./Input";
import { ProfileData } from "@/types/profile";

export default function JokerEntry({ jokerKey, profile, setProfile, stake }: { stake: number, jokerKey: string; profile: ProfileData; setProfile: (settings: ProfileData) => void }) {
    const joker = Balatro.Joker[jokerKey as keyof typeof Balatro.Joker];
    const usageData = profile.joker_usage[jokerKey as keyof typeof Balatro.Joker];

    // usageData: { wins: number[] | object, losses: number[] | object, count: number }
    // wins/losses are empty objects when there is no data, in that case total is 0
    const totalWins = Object.values(usageData?.wins ?? {}).reduce((a, b) => a + b, 0);
    const totalLosses = Object.values(usageData?.losses ?? {}).reduce((a, b) => a + b, 0);

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
        <tr>
            <td><Info info={<Joker joker={jokerKey} />}><h3>{joker.name}</h3></Info></td>
            <td className="text-center">{usageData?.count ?? 0}</td>
            <td className="text-center">{stake === -1 ? totalWins : usageData?.wins[stake] ?? 0}</td>
            <td className="text-center">{stake === -1 ? totalLosses : usageData?.losses[stake] ?? 0}</td>
        </tr>
    </>);
}