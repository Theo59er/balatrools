import { Balatro, DiscoverableItem } from "@/lib/gamedata"

export type MetaData = {
    alerted: Partial<Record<DiscoverableItem, boolean>>;
    discovered: Partial<Record<DiscoverableItem, boolean>>;
    unlocked: Partial<Record<DiscoverableItem, boolean>>;
}