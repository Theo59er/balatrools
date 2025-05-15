import { Balatro } from "@/lib/gamedata";
import EditorInput from "../EditorInput";
import Info from "../Info";
import { useState, useEffect } from "react";
import Input from "../Input";
import { SaveData } from "@/types/save";

interface SaveEditorProps {
    data: SaveData;
    setData: (data: SaveData) => void;
}

export default function SaveEditor({ data, setData }: SaveEditorProps) {
    const [jokerSearch, setJokerSearch] = useState<string>("");
    const [localData, setLocalData] = useState<SaveData>(data);

    useEffect(() => {
        setLocalData(data);
    }, [data]);

    useEffect(() => {
        if (!localData.unlocked) {
            setLocalData((prev: SaveData) => ({
                ...prev,
                unlocked: {}
            }));
        }
    }, [localData]);

    const updateData = (newData: SaveData) => {
        setLocalData(newData);
        setData(newData);
    };

    const unlockAllJokers = () => {
        const newData: SaveData = {
            ...localData,
            unlocked: Object.keys(Balatro.Joker).reduce((acc, key) => ({
                ...acc,
                [key]: true
            }), {}),
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
        <Info info="Aktuelle Spieldaten"><h2>Aktuelles Spiel (noch nicht so funktionabel)</h2></Info>
        
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
                                    const newData: SaveData = {
                                        ...localData,
                                        unlocked: {
                                            ...localData.unlocked,
                                            [jokerKey]: !isUnlocked
                                        },
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