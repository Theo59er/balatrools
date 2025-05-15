/**
 * Der Haupteditor für Balatro Saves - hier läuft alles zusammen!
 * Hier können Spieler ihre .jkr Dateien hochladen und bearbeiten.
 * Der Editor synchronisiert Änderungen zwischen meta.jkr, save.jkr und profile.jkr.
 * 
 * The main editor for Balatro saves - this is where everything comes together!
 * Players can upload and edit their .jkr files here.
 * The editor synchronizes changes between meta.jkr, save.jkr and profile.jkr.
 */

"use client";

import Button from "@/components/Button";
import ProfileEditor from "@/components/editors/Profile";
import SettingsEditor from "@/components/editors/Settings";
import FileInput from "@/components/FileInput";
import Subtext from "@/components/Subtext";
import { processFile, processJSON } from "@/lib/jkrFile";
import { useEffect, useState } from "react";
import Info from "@/components/Info";
import JsonEditor from "@/components/editors/Json";
import dynamic from 'next/dynamic';

const SaveEditor = dynamic(() => import("@/components/editors/Save"));
const MetaEditor = dynamic(() => import("@/components/editors/Meta"));

/**
 * Definiert den Typ einer hochgeladenen Datei mit ihren Eigenschaften
 * 
 * Defines the type of an uploaded file with its properties
 */
interface FileEntry {
    file: File;           // Die originale Datei / The original file
    type: string | null;  // Der Dateityp (meta/save/profile/settings) / The file type
    data: any;           // Der geparste JSON-Inhalt / The parsed JSON content
}

export default function EditorPage() {
    // Speichert alle hochgeladenen Dateien
    // Stores all uploaded files
    const [files, setFiles] = useState<FileEntry[]>([]);

    // Die aktuell ausgewählte Datei
    // Currently selected file
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    // Zeigt Fehlermeldungen an
    // Shows error messages
    const [error, setError] = useState<string | null>(null);

    // Schaltet zwischen normalem Editor und JSON-Ansicht um
    // Toggles between normal editor and JSON view
    const [editorMode, setEditorMode] = useState<"normal" | "json">("normal");

    // Prüft ob alle benötigten Dateien da sind
    // Checks if all required files are present
    const hasAllRequiredFiles = 
        files.some(f => f.type === "meta") &&
        files.some(f => f.type === "save") &&
        files.some(f => f.type === "profile");

    // Die aktuell ausgewählte Datei oder null
    // The currently selected file or null
    const selectedFile = selectedIndex >= 0 ? files[selectedIndex] : null;

    /**
     * Synchronisiert Joker-Zustände zwischen den Dateien
     * Wenn ein Joker in einer Datei freigeschaltet/gesperrt wird,
     * wird dieser Status in allen anderen Dateien übernommen.
     * 
     * Synchronizes joker states between files
     * When a joker is unlocked/locked in one file,
     * this state is propagated to all other files.
     */
    const syncJokerStates = (updatedFileIndex: number, newData: any) => {
        const updatedFiles = [...files];
        const updatedFile = updatedFiles[updatedFileIndex];
        
        if (!updatedFile) return;

        // Findet Meta- und Save-Dateien
        // Finds meta and save files
        const metaFile = updatedFiles.find(f => f.type === "meta");
        const saveFile = updatedFiles.find(f => f.type === "save");
        const profileFile = updatedFiles.find(f => f.type === "profile");

        // Aktualisiert zuerst die aktuelle Datei
        // Updates the current file first
        updatedFiles[updatedFileIndex] = { ...updatedFile, data: newData };

        if (updatedFile.type === "meta" && saveFile) {
            // Synchronisiert von Meta zu Save
            // Syncs from meta to save
            saveFile.data.unlocked = { ...newData.unlocked };
        } else if (updatedFile.type === "save" && metaFile) {
            // Synchronisiert von Save zu Meta
            // Syncs from save to meta
            metaFile.data.unlocked = { ...newData.unlocked };
            metaFile.data.discovered = { ...newData.unlocked }; // Markiert auch als entdeckt / Also marks as discovered
        }

        // Aktualisiert das unlocked_jokers Array des Profils
        // Updates profile's unlocked_jokers array
        if (profileFile && (updatedFile.type === "meta" || updatedFile.type === "save")) {
            const newUnlockedJokers = Object.entries(newData.unlocked)
                .filter(([_, isUnlocked]) => isUnlocked)
                .map(([key]) => key);
            
            profileFile.data.unlocked_jokers = newUnlockedJokers;
        }

        setFiles(updatedFiles);
    };

    /**
     * Aktualisiert die Daten einer Datei und synchronisiert sie
     * Updates a file's data and synchronizes it
     */
    const updateFileData = (index: number, newData: any) => {
        syncJokerStates(index, newData);
    };

    /**
     * Bestimmt den Typ einer Datei basierend auf ihrem Namen
     * Determines the type of a file based on its name
     */
    function getFileType(fileName: string) {
        if (fileName.includes("settings")) return "settings";
        if (fileName.includes("meta")) return "meta";
        if (fileName.includes("profile")) return "profile";
        if (fileName.includes("save")) return "save";
        return null;
    }

    /**
     * Verarbeitet hochgeladene Dateien
     * Processes uploaded files
     */
    async function handleFiles(newFiles: File[]) {
        const fileEntries: FileEntry[] = [];
        
        for (const file of newFiles) {
            const type = getFileType(file.name);
            if (!type) {
                setError(`Unknown file type for ${file.name}`);
                continue;
            }

            try {
                const buffer = await file.arrayBuffer();
                const data = new Uint8Array(buffer);
                const processedData = processFile(data);

                // Initialisiert das unlocked Objekt für Save-Dateien, falls es nicht existiert
                // Initializes unlocked object for save files if it doesn't exist
                if (type === "save" && !processedData.unlocked) {
                    processedData.unlocked = {};
                }

                fileEntries.push({
                    file,
                    data: processedData,
                    type
                });
            } catch (err) {
                setError(`Error processing ${file.name}: ${err}`);
            }
        }

        setFiles(fileEntries);
        setSelectedIndex(fileEntries.length > 0 ? 0 : -1);
        setError(null);
    }

    /**
     * Lädt eine Datei herunter
     * Downloads a file
     */
    function download(index: number) {
        const fileEntry = files[index];
        if (!fileEntry) return;

        const rawData = processJSON(fileEntry.data);
        const blob = new Blob([rawData]);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileEntry.file.name;
        link.click();
    }

    /**
     * Lädt alle Dateien herunter
     * Downloads all files
     */
    function downloadAll() {
        files.forEach((_, index) => download(index));
    }

    return (
        <main className="min-h-screen p-8 bg-bg-0">
            <div className="max-w-5xl mx-auto flex flex-col gap-4">
                <Info info={<>
                    Save files (.jkr) can be found at:
                    {"\n"}- Windows: %APPDATA%/Balatro
                    {"\n"}- Linux: [steam path]/compat-data/2379780/pfx/drive_c/users/steamuser/AppData/Roaming/Balatro/
                    {"\n"}- Mac: /Users/[user]/Library/Application Support/Balatro/
                </>}>
                    <h1>Balatro Save Editor</h1>
                </Info>                
                <Subtext>
                    Modded files will not work properly. Please do not report any issues regarding modded files.
                </Subtext>

                <FileInput onFileChange={handleFiles} />
                
                {error && (
                    <div className="text-red-500">{error}</div>
                )}

                {/* Überprüft, ob alle erforderlichen Dateien vorhanden sind */}
                {/* Checks if all required files are present */}
                {files.length > 0 && !files.some(f => f.type === "meta") && (
                    <div className="text-yellow-500">Bitte lade die meta.jkr Datei hoch</div>
                )}
                {files.length > 0 && !files.some(f => f.type === "save") && (
                    <div className="text-yellow-500">Bitte lade die save.jkr Datei hoch</div>
                )}
                {files.length > 0 && !files.some(f => f.type === "profile") && (
                    <div className="text-yellow-500">Bitte lade die profile.jkr Datei hoch</div>
                )}

                {files.length > 0 && (
                    <>
                        <div className="flex flex-col gap-4 bg-bg-1 p-4 rounded">
                            <div className="text-lg font-bold">Loaded Files</div>
                            <div className="flex flex-wrap gap-2">
                                {files.map((entry, index) => (
                                    <button
                                        key={entry.file.name}
                                        onClick={() => setSelectedIndex(index)}
                                        className={`px-4 py-2 rounded ${
                                            index === selectedIndex 
                                                ? "bg-primary-1" 
                                                : "bg-bg-3 hover:bg-bg-4"
                                        }`}
                                    >
                                        {entry.file.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedFile && (
                            <>
                                <div className="flex gap-2 mb-4">
                                    <button 
                                        className={`px-4 py-2 rounded ${editorMode === "normal" ? "bg-primary-1" : "bg-bg-3 hover:bg-bg-4"}`}
                                        onClick={() => setEditorMode("normal")}
                                    >
                                        Standard Editor
                                    </button>
                                    <button 
                                        className={`px-4 py-2 rounded ${editorMode === "json" ? "bg-primary-1" : "bg-bg-3 hover:bg-bg-4"}`}
                                        onClick={() => setEditorMode("json")}
                                    >
                                        JSON Editor
                                    </button>
                                </div>                                
                                {editorMode === "normal" ? (
                                    <>
                                        {selectedFile.type === "settings" && 
                                            <SettingsEditor 
                                                data={selectedFile.data} 
                                                setData={(data: any) => updateFileData(selectedIndex, data)} 
                                            />
                                        }
                                        {selectedFile.type === "meta" && 
                                            (hasAllRequiredFiles ? (
                                                <MetaEditor 
                                                    data={selectedFile.data} 
                                                    setData={(data: any) => updateFileData(selectedIndex, data)} 
                                                />
                                            ) : (
                                                <div className="text-yellow-500 p-4">
                                                    Bitte lade zuerst alle erforderlichen Dateien hoch (meta.jkr, save.jkr und profile.jkr)
                                                </div>
                                            ))
                                        }
                                        {selectedFile.type === "profile" && 
                                            (hasAllRequiredFiles ? (
                                                <ProfileEditor 
                                                    data={selectedFile.data} 
                                                    setData={(data: any) => updateFileData(selectedIndex, data)} 
                                                />
                                            ) : (
                                                <div className="text-yellow-500 p-4">
                                                    Bitte lade zuerst alle erforderlichen Dateien hoch (meta.jkr, save.jkr und profile.jkr)
                                                </div>
                                            ))
                                        }
                                        {selectedFile.type === "save" && 
                                            (hasAllRequiredFiles ? (
                                                <SaveEditor 
                                                    data={selectedFile.data} 
                                                    setData={(data: any) => updateFileData(selectedIndex, data)} 
                                                />
                                            ) : (
                                                <div className="text-yellow-500 p-4">
                                                    Bitte lade zuerst alle erforderlichen Dateien hoch (meta.jkr, save.jkr und profile.jkr)
                                                </div>
                                            ))
                                        }
                                    </>
                                ) : (
                                    <JsonEditor 
                                        data={selectedFile.data} 
                                        setData={(data: any) => updateFileData(selectedIndex, data)} 
                                    />
                                )}

                                <div className="flex gap-2">
                                    <Button onClick={() => download(selectedIndex)}>
                                        Save Current File
                                    </Button>
                                    <Button onClick={downloadAll}>
                                        Save All Files
                                    </Button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
