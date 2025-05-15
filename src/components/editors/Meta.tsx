/**
 * Der Meta-Editor ist dein Werkzeug für die Joker-Verwaltung!
 * Hier kannst du Joker freischalten, sperren und deren Status verwalten.
 * Die Änderungen werden automatisch mit den anderen Dateien synchronisiert.
 * 
 * The Meta-Editor is your tool for joker management!
 * Here you can unlock, lock and manage the status of jokers.
 * Changes are automatically synchronized with the other files.
 */

import { useState, useEffect } from "react";
import { Balatro } from "@/lib/gamedata";
import Info from "../Info";
import Input from "../Input";

export default function MetaEditor({ data, setData }: { data: any, setData: (data: any) => void }) {
    // Suchfeld für die Joker-Liste
    // Search field for the joker list
    const [jokerSearch, setJokerSearch] = useState<string>("");
    
    // Stellt sicher, dass die Grundstruktur existiert
    // Ensures the basic structure exists
    useEffect(() => {
        if (!data.discovered || !data.unlocked) {
            setData({
                ...data,
                discovered: data.discovered || {},
                unlocked: data.unlocked || {}
            });
        }
    }, [data]);

    /**
     * Schaltet einen Joker um (frei/gesperrt)
     * Der Status wird in allen verknüpften Dateien aktualisiert
     * 
     * Toggles a joker (unlocked/locked)
     * The status is updated in all linked files
     */
    const toggleJoker = (jokerKey: string) => {
        const newData = { ...data };
        const currentState = newData.unlocked?.[jokerKey] && newData.discovered?.[jokerKey];
        
        // Toggle both states together
        newData.unlocked = {
            ...newData.unlocked,
            [jokerKey]: !currentState
        };
        newData.discovered = {
            ...newData.discovered,
            [jokerKey]: !currentState
        };
        
        setData(newData);
    };

    return (
        <div className="flex flex-col gap-4">
            <Info info="Joker freischalten oder sperren">
                <h2>Joker Editor</h2>
            </Info>

            <Input
                placeholder="Joker suchen..."
                type="text"
                className="w-full"
                value={jokerSearch}
                onChange={e => setJokerSearch(e.target.value)}
            />

            <div className="grid grid-cols-6 gap-4">
                {Object.entries(Balatro.Joker)
                    .filter(([key]) => key.toLowerCase().includes(jokerSearch.toLowerCase()))
                    .sort(([,a], [,b]) => a.order - b.order)
                    .map(([key, joker]) => {
                        const isUnlocked = data.unlocked?.[key] === true && data.discovered?.[key] === true;
                        
                        return (
                            <div
                                key={key}
                                onClick={() => toggleJoker(key)}
                                className={`
                                    relative cursor-pointer rounded-lg overflow-hidden transition-all
                                    ${!isUnlocked ? 'opacity-50 hover:opacity-75' : 'hover:brightness-110'}
                                    border-2 ${isUnlocked ? 'border-green-500' : 'border-red-500'}
                                `}
                            >
                                <img 
                                    src={`/jokers/${joker.name.replace(/ /g, '_')}.webp`}
                                    alt={joker.name}
                                    className="w-full h-auto"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-75 p-2">
                                    <div className="text-white text-center text-sm">
                                        <div className="font-bold truncate">{joker.name}</div>
                                        <div className="text-xs">
                                            {isUnlocked ? '✅ Freigeschaltet' : '🔒 Gesperrt'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
                <button 
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                    onClick={() => {
                        const newData = { ...data };
                        Object.keys(Balatro.Joker).forEach(key => {
                            newData.unlocked = { ...newData.unlocked, [key]: true };
                            newData.discovered = { ...newData.discovered, [key]: true };
                        });
                        setData(newData);
                    }}
                >
                    Alle Joker freischalten
                </button>
                <button 
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                    onClick={() => {
                        const newData = { ...data };
                        Object.keys(Balatro.Joker).forEach(key => {
                            newData.unlocked = { ...newData.unlocked, [key]: false };
                            newData.discovered = { ...newData.discovered, [key]: false };
                        });
                        setData(newData);
                    }}
                >
                    Alle Joker sperren
                </button>
            </div>
        </div>
    );
}