import { useState } from "react";
import EditorInput from "../EditorInput";
import Info from "../Info";
import { ProfileData } from "@/types/profile";
import { Balatro } from "@/lib/gamedata";
import JokerEntry from "../JokerEntry";

export default function ProfileEditor({ data }: { data: ProfileData }) {
    const [profile, setProfile] = useState(data);

    return (<>
        <Info info="Stats for this profile"><h2>Profile</h2></Info>
        <EditorInput label="Profile Name" type="string" setting="name" settings={profile} setSettings={setProfile} />
    
        <h2>Career Stats</h2>
        <EditorInput label="Cards Discarded" type="number" setting="career_stats.c_cards_discarded" settings={profile} setSettings={setProfile} />
        <EditorInput label="Hands Played" type="number" setting="career_stats.c_hands_played" settings={profile} setSettings={setProfile} />
        <EditorInput label="Dollars Earned" type="number" setting="career_stats.c_dollars_earned" settings={profile} setSettings={setProfile} />
        <EditorInput label="Cards Played" type="number" setting="career_stats.c_cards_played" settings={profile} setSettings={setProfile} />
        <EditorInput label="Planetarium Used" type="number" setting="career_stats.c_planetarium_used" settings={profile} setSettings={setProfile} />
        <EditorInput label="Wins" type="number" setting="career_stats.c_wins" settings={profile} setSettings={setProfile} />
        <EditorInput label="Shop Rerolls" type="number" setting="career_stats.c_shop_rerolls" settings={profile} setSettings={setProfile} />
        <EditorInput label="Interest Cap Streak" type="number" setting="career_stats.c_round_interest_cap_streak" settings={profile} setSettings={setProfile} />
        <EditorInput label="Losses" type="number" setting="career_stats.c_losses" settings={profile} setSettings={setProfile} />
        <EditorInput label="Tarots Bought" type="number" setting="career_stats.c_tarots_bought" settings={profile} setSettings={setProfile} />
        <EditorInput label="Shop Dollars Spent" type="number" setting="career_stats.c_shop_dollars_spent" settings={profile} setSettings={setProfile} />
        <EditorInput label="Single Hand Streak" type="number" setting="career_stats.c_single_hand_round_streak" settings={profile} setSettings={setProfile} />
        <EditorInput label="Planet Cards Bought" type="number" setting="career_stats.c_planets_bought" settings={profile} setSettings={setProfile} />
        <EditorInput label="Vouchers Bought" type="number" setting="career_stats.c_vouchers_bought" settings={profile} setSettings={setProfile} />
        <EditorInput label="Tarot Reading Used" type="number" setting="career_stats.c_tarot_reading_used" settings={profile} setSettings={setProfile} />
        <EditorInput label="Rounds" type="number" setting="career_stats.c_rounds" settings={profile} setSettings={setProfile} />
        <EditorInput label="Jokers Sold" type="number" setting="career_stats.c_jokers_sold" settings={profile} setSettings={setProfile} />
        <EditorInput label="Face Cards Played" type="number" setting="career_stats.c_face_cards_played" settings={profile} setSettings={setProfile} />
        <EditorInput label="Playing Cards Bought" type="number" setting="career_stats.c_playing_cards_bought" settings={profile} setSettings={setProfile} />
        <EditorInput label="Cards Sold" type="number" setting="career_stats.c_cards_sold" settings={profile} setSettings={setProfile} />
    
        <h2>Joker Usage</h2>
        {Object.keys(Balatro.Joker).sort((a, b) => Balatro.Joker[a as keyof typeof Balatro.Joker].order - Balatro.Joker[b as keyof typeof Balatro.Joker].order).map((key) => (
            <JokerEntry key={key} stake={0} jokerKey={key} profile={profile} setProfile={setProfile} />
        ))}
    </>);
}