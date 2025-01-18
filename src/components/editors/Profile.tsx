import { useState } from "react";
import EditorInput from "../EditorInput";
import Info from "../Info";
import { ProfileData } from "@/types/profile";
import { Balatro } from "@/lib/gamedata";
import JokerEntry from "../JokerEntry";
import Input from "../Input";
import Button from "../Button";
import Stake from "../infocards/Stake";

function StakeButton({ index, selected, setSelectedStake }: { index: number, selected: boolean, setSelectedStake: (index: number) => void }) {
    const stake = Balatro.Stake[Object.keys(Balatro.Stake)[index] as keyof typeof Balatro.Stake];

    return (<div
        className={"p-2 bg-bg-3 w-full hover:bg-bg-4 shadow cursor-pointer rounded-lg flex flex-col " + (selected ? "bg-primary-1 hover:!bg-primary-2" : "")} 
        onClick={() => setSelectedStake(index)}
    >
        <Info info={<Stake stake={Object.keys(Balatro.Stake)[index]} />} className="flex flex-col gap-2 w-full" noIcon>
            <img className="w-full h-full mb-2" src={"stakes/" +stake.name.replace(" ", "_") + ".webp"} />
            <h3 className="text-center">{stake.name.replace(" Stake", "")}</h3>
        </Info>
    </div>);
}

export default function ProfileEditor({ data, setData }: { data: ProfileData, setData: (data: ProfileData) => void }) {
    const [selectedStake, setSelectedStake] = useState<number>(0);
    const [jokerSearch, setJokerSearch] = useState<string>("");

    return (<>
        <Info info="Stats for this profile"><h2>Profile</h2></Info>
        <EditorInput label="Profile Name" type="string" setting="name" settings={data} setSettings={setData} />
    
        <h2>Career Stats</h2>
        <EditorInput label="Cards Discarded" type="number" setting="career_stats.c_cards_discarded" settings={data} setSettings={setData} />
        <EditorInput label="Hands Played" type="number" setting="career_stats.c_hands_played" settings={data} setSettings={setData} />
        <EditorInput label="Dollars Earned" type="number" setting="career_stats.c_dollars_earned" settings={data} setSettings={setData} />
        <EditorInput label="Cards Played" type="number" setting="career_stats.c_cards_played" settings={data} setSettings={setData} />
        <EditorInput label="Planetarium Used" type="number" setting="career_stats.c_planetarium_used" settings={data} setSettings={setData} />
        <EditorInput label="Wins" type="number" setting="career_stats.c_wins" settings={data} setSettings={setData} />
        <EditorInput label="Shop Rerolls" type="number" setting="career_stats.c_shop_rerolls" settings={data} setSettings={setData} />
        <EditorInput label="Interest Cap Streak" type="number" setting="career_stats.c_round_interest_cap_streak" settings={data} setSettings={setData} />
        <EditorInput label="Losses" type="number" setting="career_stats.c_losses" settings={data} setSettings={setData} />
        <EditorInput label="Tarots Bought" type="number" setting="career_stats.c_tarots_bought" settings={data} setSettings={setData} />
        <EditorInput label="Shop Dollars Spent" type="number" setting="career_stats.c_shop_dollars_spent" settings={data} setSettings={setData} />
        <EditorInput label="Single Hand Streak" type="number" setting="career_stats.c_single_hand_round_streak" settings={data} setSettings={setData} />
        <EditorInput label="Planet Cards Bought" type="number" setting="career_stats.c_planets_bought" settings={data} setSettings={setData} />
        <EditorInput label="Vouchers Bought" type="number" setting="career_stats.c_vouchers_bought" settings={data} setSettings={setData} />
        <EditorInput label="Tarot Reading Used" type="number" setting="career_stats.c_tarot_reading_used" settings={data} setSettings={setData} />
        <EditorInput label="Rounds" type="number" setting="career_stats.c_rounds" settings={data} setSettings={setData} />
        <EditorInput label="Jokers Sold" type="number" setting="career_stats.c_jokers_sold" settings={data} setSettings={setData} />
        <EditorInput label="Face Cards Played" type="number" setting="career_stats.c_face_cards_played" settings={data} setSettings={setData} />
        <EditorInput label="Playing Cards Bought" type="number" setting="career_stats.c_playing_cards_bought" settings={data} setSettings={setData} />
        <EditorInput label="Cards Sold" type="number" setting="career_stats.c_cards_sold" settings={data} setSettings={setData} />
    
        <h2>Joker Usage</h2>
        <Info info="Stake to show win/loss data for. Press 'All' to see data for all stakes"><h3>Stake</h3></Info>
        <Button onClick={() => setSelectedStake(-1)} className={selectedStake !== -1 ? "!bg-bg-3 hover:!bg-bg-4" : ""}>All</Button>
        <div className="flex flex-row gap-2 items-center">
            {Object.keys(Balatro.Stake).map((_, index) => (
                <StakeButton key={index} index={index} selected={selectedStake === index} setSelectedStake={setSelectedStake} />
            ))}
        </div>
        <Input placeholder="Search Jokers" type="text" className="w-full" value={jokerSearch} onChange={e => setJokerSearch(e.target.value)} />
        <table>
            <thead>
                <tr>
                    <th>Joker</th>
                    <th>Rounds Complete</th>
                    <th>Wins</th>
                    <th>Losses</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(Balatro.Joker).filter(v => v.includes(jokerSearch)).sort((a, b) => Balatro.Joker[a as keyof typeof Balatro.Joker].order - Balatro.Joker[b as keyof typeof Balatro.Joker].order).map((key) => (
                    <JokerEntry key={key} stake={selectedStake} jokerKey={key} profile={data} setProfile={setData} />
                ))}
            </tbody>
        </table>
    </>);
}