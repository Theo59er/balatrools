/**
 * Der Save-Editor verwaltet den aktuellen Spielstand.
 * Hier können Spieler den Zustand des laufenden Spiels bearbeiten,
 * einschließlich freigeschalteter Joker, Geld und Rundenzahl.
 * 
 * The Save Editor manages the current game state.
 * Here players can edit the state of the ongoing game,
 * including unlocked jokers, money and round number.
 */

import { Balatro } from "@/lib/gamedata";
import EditorInput from "../EditorInput";
import Info from "../Info";
import { useState, useEffect } from "react";
import Input from "../Input";

export default function SaveEditor({ data, setData }: { data: any, setData: (data: any) => void }) {
    // Lokaler State für die Joker-Suche
    // Local state for joker search
    const [jokerSearch, setJokerSearch] = useState<string>("");

    // Lokaler State für die Spieldaten
    // Local state for game data
    const [localData, setLocalData] = useState<any>(data);

    // Synchronisiere localData wenn sich data ändert
    // Synchronize localData when data changes
    useEffect(() => {
        setLocalData(data);
    }, [data]);

    // Stelle sicher, dass unlocked-Objekt existiert
    // Ensure unlocked object exists
    useEffect(() => {
        if (!localData.unlocked) {
            setLocalData((prev: any) => ({
                ...prev,
                unlocked: {}
            }));
        }
    }, [localData]);

    // Aktualisiert Daten und sendet sie nach oben
    // Updates data and sends it up
    const updateData = (newData: any) => {
        setLocalData(newData);
        setData(newData);
    };

    // Schaltet alle Joker frei
    // Unlocks all jokers
    const unlockAllJokers = () => {
        const newData = {
            ...localData,
            unlocked: Object.keys(Balatro.Joker).reduce((acc, key) => ({
                ...acc,
                [key]: true
            }), {}),
            // Auch für profile.jkr
            // Also for profile.jkr
            joker_usage: {
                ...localData.joker_usage,
                ...Object.keys(Balatro.Joker).reduce((acc, key) => ({
                    ...acc,
                    [key]: { count: 0, wins: {}, losses: {} }
                }), {})
            }
        };
        updateData(newData);
    };

    return (<>
        <Info info="Aktuelle Spieldaten"><h2>Aktuelles Spiel</h2></Info>
        
        <div className="flex justify-between items-center mb-2">
            <h3>Freigeschaltete Joker</h3>
            <button 
                className="px-4 py-2 bg-bg-3 hover:bg-bg-4 rounded"
                onClick={unlockAllJokers}
            >
                Alles freischalten
            </button>
        </div>

        <Input
            placeholder="Joker suchen..."
            type="text"
            className="w-full"
            value={jokerSearch}
            onChange={e => setJokerSearch(e.target.value)}
        />
        
        <div className="grid grid-cols-2 gap-2">
            {/* Zeigt alle Joker sortiert nach ihrer Order an
                Shows all jokers sorted by their order */}
            {Object.keys(Balatro.Joker)
                .filter(v => v.toLowerCase().includes(jokerSearch.toLowerCase()))
                .sort((a, b) => (
                    Balatro.Joker[a as keyof typeof Balatro.Joker].order - 
                    Balatro.Joker[b as keyof typeof Balatro.Joker].order
                ))
                .map(jokerKey => {
                    const isUnlocked = localData?.unlocked?.[jokerKey] === true;
                    const joker = Balatro.Joker[jokerKey as keyof typeof Balatro.Joker];
                    return (
                        <div key={jokerKey} className="flex items-center gap-2 p-2 hover:bg-bg-2">
                            <Input
                                type="checkbox"
                                checked={isUnlocked || false}
                                onChange={() => {
                                    const newData = {
                                        ...localData,
                                        unlocked: {
                                            ...localData.unlocked,
                                            [jokerKey]: !isUnlocked
                                        },
                                        // Aktualisiert auch die Nutzungsstatistik
                                        // Also updates usage statistics
                                        joker_usage: {
                                            ...localData.joker_usage,
                                            [jokerKey]: !isUnlocked ? 
                                                { count: 0, wins: {}, losses: {} } : 
                                                localData.joker_usage?.[jokerKey]
                                        }
                                    };
                                    updateData(newData);
                                }}
                            />
                            <div>
                                <div className="font-bold">{joker.name}</div>
                                <div className="text-sm text-gray-400">{joker.unlock || "Available from start."}</div>
                            </div>
                        </div>
                    );
                })}
        </div>

        <h3>Spielfortschritt</h3>
        <EditorInput 
            label="Aktuelles Geld" 
            type="number" 
            setting="money" 
            settings={localData} 
            setSettings={updateData}
        />
        <EditorInput 
            label="Aktuelle Runde" 
            type="number" 
            setting="round" 
            settings={localData} 
            setSettings={updateData}
        />
        <EditorInput 
            label="Aktuelle Ante" 
            type="number" 
            setting="ante" 
            settings={localData} 
            setSettings={updateData}
        />
    </>);
}