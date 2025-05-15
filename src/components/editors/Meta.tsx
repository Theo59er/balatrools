import { useState, useEffect } from "react";
import { Balatro } from "@/lib/gamedata";
import Info from "../Info";
import Input from "../Input";
import { MetaData } from "@/types/meta";

type CardType = 'joker' | 'spectral' | 'tarot' | 'planet';

// Neuer Typ für die Keys aller Kartenarten
type CardKey = keyof typeof Balatro.Joker | keyof typeof Balatro.Spectral | keyof typeof Balatro.Tarot | keyof typeof Balatro.Planet;

interface MetaEditorProps {
    data: MetaData;
    setData: (data: MetaData) => void;
}

export default function MetaEditor({ data, setData }: MetaEditorProps) {
    const [cardSearch, setCardSearch] = useState<string>("");
    const [activeTab, setActiveTab] = useState<CardType>("joker");
    
    // Ensure the required objects exist in the data
    useEffect(() => {
        if (!data.discovered || !data.unlocked) {
            setData({
                ...data,
                discovered: data.discovered || {},
                unlocked: data.unlocked || {}
            });
        }
    }, [data, setData]);

    const toggleCard = (cardKey: CardKey) => {
        const newData = { ...data };
        const currentState = newData.unlocked?.[cardKey] && newData.discovered?.[cardKey];
        
        // Toggle both states together
        newData.unlocked = {
            ...newData.unlocked,
            [cardKey]: !currentState
        };
        newData.discovered = {
            ...newData.discovered,
            [cardKey]: !currentState
        };
        
        setData(newData);
    };

    const getCardsForType = () => {
        switch (activeTab) {
            case 'joker':
                return Object.entries(Balatro.Joker);
            case 'spectral':
                return Object.entries(Balatro.Spectral);
            case 'tarot':
                return Object.entries(Balatro.Tarot);
            case 'planet':
                return Object.entries(Balatro.Planet);
            default:
                return [];
        }
    };

    const getCardImagePath = (key: string, name: string, type: CardType) => {
        const filename = name.replace(/ /g, '_');
        switch (type) {
            case 'spectral':
                return `/spectral_cards/Spectral_${filename}.webp`;
            case 'tarot':
                return `/tarot/Tarot_${filename}.webp`;
            case 'planet':
                return `/planets/Planet_${filename}.webp`;
            default:
                return `/jokers/${filename}.webp`;
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <Info info="Karten freischalten oder sperren">
                <h2>Karten Editor</h2>
            </Info>

            <div className="flex gap-2 mb-4">
                <button
                    className={`px-4 py-2 rounded ${activeTab === 'joker' ? 'bg-orange-600' : 'bg-gray-600'} hover:brightness-110`}
                    onClick={() => setActiveTab('joker')}
                >
                    Joker
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeTab === 'spectral' ? 'bg-blue-600' : 'bg-gray-600'} hover:brightness-110`}
                    onClick={() => setActiveTab('spectral')}
                >
                    Spectral
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeTab === 'tarot' ? 'bg-purple-600' : 'bg-gray-600'} hover:brightness-110`}
                    onClick={() => setActiveTab('tarot')}
                >
                    Tarot
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeTab === 'planet' ? 'bg-cyan-600' : 'bg-gray-600'} hover:brightness-110`}
                    onClick={() => setActiveTab('planet')}
                >
                    Planet
                </button>
            </div>

            <Input
                placeholder="Karten suchen..."
                type="text"
                className="w-full"
                value={cardSearch}
                onChange={e => setCardSearch(e.target.value)}
            />

            <div className="grid grid-cols-5 gap-4">
                {getCardsForType()
                    .filter(([key, card]) => card.name.toLowerCase().includes(cardSearch.toLowerCase()))
                    .sort(([,a], [,b]) => a.name.localeCompare(b.name))
                    .map(([key, card]) => {
                        const typedKey = key as CardKey;
                        const isUnlocked = data.unlocked?.[typedKey] === true && data.discovered?.[typedKey] === true;
                        
                        return (
                            <div
                                key={key}
                                onClick={() => toggleCard(typedKey)}
                                className={`
                                    relative cursor-pointer rounded-lg overflow-hidden transition-all
                                    ${!isUnlocked ? 'opacity-50 hover:opacity-75' : 'hover:brightness-110'}
                                    border-2 ${isUnlocked ? 'border-green-500' : 'border-red-500'}
                                `}
                            >
                                <img 
                                    src={getCardImagePath(key, card.name, activeTab)}
                                    alt={card.name}
                                    className="w-full h-auto"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-75 p-2">
                                    <div className="text-white text-center text-sm">
                                        <div className="font-bold truncate">{card.name}</div>
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
                        const cards = getCardsForType();
                        cards.forEach(([key]) => {
                            const typedKey = key as CardKey;
                            newData.unlocked = { ...newData.unlocked, [typedKey]: true };
                            newData.discovered = { ...newData.discovered, [typedKey]: true };
                        });
                        setData(newData);
                    }}
                >
                    Alle {activeTab === 'joker' ? 'Joker' : activeTab === 'spectral' ? 'Spectral Karten' : 
                         activeTab === 'tarot' ? 'Tarot Karten' : 'Planet Karten'} freischalten
                </button>
                <button 
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                    onClick={() => {
                        const newData = { ...data };
                        const cards = getCardsForType();
                        cards.forEach(([key]) => {
                            const typedKey = key as CardKey;
                            newData.unlocked = { ...newData.unlocked, [typedKey]: false };
                            newData.discovered = { ...newData.discovered, [typedKey]: false };
                        });
                        setData(newData);
                    }}
                >
                    Alle {activeTab === 'joker' ? 'Joker' : activeTab === 'spectral' ? 'Spectral Karten' : 
                         activeTab === 'tarot' ? 'Tarot Karten' : 'Planet Karten'} sperren
                </button>
            </div>
        </div>
    );
}
