import { DiscoverableItem } from "@/lib/gamedata";

export interface SaveData {
    money: number;
    round: number;
    ante: number;
    unlocked: Partial<Record<DiscoverableItem, boolean>>;
    joker_usage: {
        [key: string]: {
            count: number;
            wins: Record<number, number>;
            losses: Record<number, number>;
        };
    };
}
