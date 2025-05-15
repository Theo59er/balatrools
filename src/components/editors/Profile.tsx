/**
 * Der Profil-Editor verwaltet die Langzeit-Spielerdaten.
 * Hier können Spieler ihre Statistiken, Erfolge und Joker-Historie einsehen und bearbeiten.
 * 
 * The Profile Editor manages long-term player data.
 * Here players can view and edit their statistics, achievements and joker history.
 */

import { useEffect, useState } from "react";
import EditorInput from "../EditorInput";
import Info from "../Info";
import { ProfileData } from "@/types/profile";
import { Balatro } from "@/lib/gamedata";
import JokerEntry from "../JokerEntry";
import Input from "../Input";
import Button from "../Button";
import Stake from "../infocards/Stake";

/**
 * Ein Button zum Filtern der Joker-Statistiken nach Einsatz
 * A button to filter joker statistics by stake
 */
function StakeButton({ index, selected, setSelectedStake }:
    { index: number, selected: boolean, setSelectedStake: (index: number) => void }) {
    const stake = Balatro.Stake[Object.keys(Balatro.Stake)[index] as keyof typeof Balatro.Stake];

    return (<div
        className={
            `p-2 bg-bg-3 w-full h-full hover:bg-bg-4 shadow cursor-pointer rounded-lg flex flex-col 
            ${selected ? "bg-primary-1 hover:!bg-primary-2" : ""}`
        }
        onClick={() => setSelectedStake(index)}
    >
        <Info info={<Stake stake={Object.keys(Balatro.Stake)[index]} />} className="flex flex-col flex-wrap gap-2 w-full" noIcon>
            <img className="mb-2 w-full h-full" src={`stakes/${stake.name.replace(" ", "_")}.webp`} />
            <h3 className="text-center">{stake.name.replace(" Stake", "")}</h3>
        </Info>
    </div>);
}

export default function ProfileEditor({ data, setData }: { data: ProfileData, setData: (data: ProfileData) => void }) {
    // Ausgewählter Spieleinsatz für die Statistik-Ansicht
    // Selected stake for statistics view
    const [selectedStake, setSelectedStake] = useState<number>(-1);

    // Suchfeld für die Joker-Liste
    // Search field for the joker list
    const [jokerSearch, setJokerSearch] = useState<string>("");

    // Stelle sicher, dass joker_usage und unlocked_jokers existieren
    // Ensure joker_usage and unlocked_jokers exist
    useEffect(() => {
        if (!data.joker_usage || !data.unlocked_jokers) {
            setData({
                ...data,
                joker_usage: data.joker_usage || {},
                unlocked_jokers: data.unlocked_jokers || []
            });
        }
    }, [data]);

    /**
     * Schaltet alle Joker frei und initialisiert ihre Statistiken
     * Unlocks all jokers and initializes their statistics
     */
    const unlockAllJokers = () => {
        const jokerList = Object.keys(Balatro.Joker);
        const stakeCount = Object.keys(Balatro.Stake).length;
        
        setData({
            ...data,
            joker_usage: jokerList.reduce((acc, key) => ({
                ...acc,
                [key]: {
                    count: 0,
                    wins: Array(stakeCount).fill(0),
                    losses: Array(stakeCount).fill(0)
                }
            }), {}),
            unlocked_jokers: jokerList // Füge alle Joker zum Array hinzu / Add all jokers to array
        });
    };

    return (<>
        <Info info="Stats for this profile"><h2>Profile</h2></Info>
        <EditorInput label="Profile Name" type="string" setting="name" settings={data} setSettings={setData} />

        <h2>Joker Management</h2>
        <div className="flex justify-between items-center mb-2">
            <h3>Joker List</h3>
            <button 
                className="px-4 py-2 bg-bg-3 hover:bg-bg-4 rounded"
                onClick={unlockAllJokers}
            >
                Alle Joker freischalten
            </button>
        </div>

        <h2>High Scores</h2>
        {/* High Scores pro Spielmodus / High Scores per game mode */}
        {Object.keys(data.high_scores).map(key => {
            if (key === "collection" || key === "current_streak")
                return null;
            const score = data.high_scores[key as keyof typeof data.high_scores];
            return <EditorInput
                key={key}
                label={score.label}
                type="number"
                setting={`high_scores.${key}.amt`}
                settings={data}
                setSettings={setData}
            />;
        })}

        {/* Karriere-Statistiken / Career Statistics */}
        <h2>Career Stats</h2>
        <EditorInput
            label="Cards Discarded" type="number" setting="career_stats.c_cards_discarded" settings={data} setSettings={setData} />
        <EditorInput
            label="Hands Played" type="number" setting="career_stats.c_hands_played" settings={data} setSettings={setData} />
        <EditorInput
            label="Dollars Earned" type="number" setting="career_stats.c_dollars_earned" settings={data} setSettings={setData} />
        <EditorInput
            label="Cards Played" type="number" setting="career_stats.c_cards_played" settings={data} setSettings={setData} />
        <EditorInput
            label="Planetarium Used" type="number" setting="career_stats.c_planetarium_used" settings={data} setSettings={setData} />
        <EditorInput
            label="Wins" type="number" setting="career_stats.c_wins" settings={data} setSettings={setData} />
        <EditorInput
            label="Shop Rerolls" type="number" setting="career_stats.c_shop_rerolls" settings={data} setSettings={setData} />
        <EditorInput
            label="Interest Cap Streak" type="number" setting="career_stats.c_round_interest_cap_streak"
            settings={data} setSettings={setData} />
        <EditorInput
            label="Losses" type="number" setting="career_stats.c_losses" settings={data} setSettings={setData} />
        <EditorInput
            label="Tarots Bought" type="number" setting="career_stats.c_tarots_bought" settings={data} setSettings={setData} />
        <EditorInput
            label="Shop Dollars Spent" type="number" setting="career_stats.c_shop_dollars_spent"
            settings={data} setSettings={setData} />
        <EditorInput
            label="Single Hand Streak" type="number" setting="career_stats.c_single_hand_round_streak"
            settings={data} setSettings={setData} />
        <EditorInput
            label="Planet Cards Bought" type="number" setting="career_stats.c_planets_bought" settings={data} setSettings={setData} />
        <EditorInput
            label="Vouchers Bought" type="number" setting="career_stats.c_vouchers_bought" settings={data} setSettings={setData} />
        <EditorInput
            label="Tarot Reading Used" type="number" setting="career_stats.c_tarot_reading_used"
            settings={data} setSettings={setData} />
        <EditorInput
            label="Rounds" type="number" setting="career_stats.c_rounds" settings={data} setSettings={setData} />
        <EditorInput
            label="Jokers Sold" type="number" setting="career_stats.c_jokers_sold" settings={data} setSettings={setData} />
        <EditorInput
            label="Face Cards Played" type="number" setting="career_stats.c_face_cards_played" settings={data} setSettings={setData} />
        <EditorInput
            label="Playing Cards Bought" type="number" setting="career_stats.c_playing_cards_bought"
            settings={data} setSettings={setData} />
        <EditorInput
            label="Cards Sold" type="number" setting="career_stats.c_cards_sold" settings={data} setSettings={setData} />

        {/* Spielfortschritt / Game Progress */}
        <h2>Progress</h2>
        <EditorInput label="Overall" type="number" setting="progress.overall_tally" settings={data} setSettings={setData} />
        <EditorInput label="Challenges" type="number" setting="progress.challenges.tally" settings={data} setSettings={setData} />
        <EditorInput label="Deck Stakes" type="number" setting="progress.deck_stakes.tally" settings={data} setSettings={setData} />
        <EditorInput label="Discovered" type="number" setting="progress.discovered.tally" settings={data} setSettings={setData} />
        <EditorInput label="Joker Stickers" type="number" setting="progress.joker_stickers.tally"
            settings={data} setSettings={setData} />

        {/* Joker-Nutzungsstatistiken / Joker Usage Statistics */}
        <Info info="Stats for all jokers. Click on any row to modify the values."><h2>Joker Usage</h2></Info>
        <Info info="Stake to show win/loss data for. Press 'All' to see data for all stakes"><h3>Stake</h3></Info>
        
        {/* Einsatz-Filter / Stake Filter */}
        <Button onClick={() => setSelectedStake(-1)} className={selectedStake !== -1 ? "!bg-bg-3 hover:!bg-bg-4" : ""}>All</Button>
        <div className="flex flex-row gap-2 items-center w-full">
            {Object.keys(Balatro.Stake).map((_, index) => (
                <StakeButton key={index} index={index} selected={selectedStake === index} setSelectedStake={setSelectedStake} />
            ))}
        </div>

        {/* Joker-Suche / Joker Search */}
        <Input
            placeholder="Search Jokers"
            type="text"
            className="w-full"
            value={jokerSearch}
            onChange={e => setJokerSearch(e.target.value)}
        />

        {/* Joker-Tabelle / Joker Table */}
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
                {Object.keys(Balatro.Joker).filter(v => v.includes(jokerSearch))
                    .sort((a, b) => (
                        Balatro.Joker[a as keyof typeof Balatro.Joker].order - Balatro.Joker[b as keyof typeof Balatro.Joker].order
                    ))
                    .map(key => (
                        <JokerEntry key={key} stake={selectedStake} jokerKey={key} profile={data} setProfile={setData} />
                    ))}
            </tbody>
        </table>
    </>);
}
