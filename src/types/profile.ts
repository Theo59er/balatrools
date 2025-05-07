import { Balatro, Consumable } from "@/lib/gamedata";

export interface Usage {
    order: string;
    count: number;
}

export interface DeckUsage {
    order: number;
    count: number;
    wins: number[];
    losses: number[];
}

export interface Progress {
    of: number;
    tally: number;
}

export interface HighScore {
    label: string;
    amt: number;
    tot?: number;
}

export interface JokerStats {
    order: number;
    count: number;
    wins: number[];
    losses: number[];
}

export interface ProfileData {
    career_stats: {
        c_cards_discarded: number;
        c_hands_played: number;
        c_dollars_earned: number;
        c_cards_played: number;
        c_planetarium_used: number;
        c_wins: number;
        c_shop_rerolls: number;
        c_round_interest_cap_streak: number;
        c_losses: number;
        c_tarots_bought: number;
        c_shop_dollars_spent: number;
        c_single_hand_round_streak: number;
        c_planets_bought: number;
        c_vouchers_bought: number;
        c_tarot_reading_used: number;
        c_rounds: number;
        c_jokers_sold: number;
        c_face_cards_played: number;
        c_playing_cards_bought: number;
        c_cards_sold: number;
    };
    joker_usage: Partial<Record<keyof typeof Balatro.Joker, JokerStats>>;
    unlocked_jokers: string[];  // Array von Joker-Keys
    MEMORY: {
        deck: string;
        stake: number;
    };
    deck_stakes: {};
    progress: {
        overall_tally: number;
        challenges: Progress;
        deck_stakes: Progress;
        discovered: Progress;
        joker_stickers: Progress;
    };
    high_scores: {
        [key: string]: HighScore;
    };
    name: string;
    unlocks: {
        challenges: Usage[];
        consumables: Record<keyof typeof Consumable, Usage>;
        deck_stakes: Usage[];
        discovered: Record<string, Usage>;
        joker_stickers: Usage[];
    };
    deck_usage: Record<string, DeckUsage>;
    version: number;
}
