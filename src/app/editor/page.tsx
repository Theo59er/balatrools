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

interface FileEntry {
    file: File;
    data: any;
    type: "settings" | "meta" | "profile" | "save" | null;
}

export default function EditorPage() {
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [error, setError] = useState<string | null>(null);
    const [editorMode, setEditorMode] = useState<"normal" | "json">("normal");

    function getFileType(fileName: string) {
        if (fileName.includes("settings")) return "settings";
        if (fileName.includes("meta")) return "meta";
        if (fileName.includes("profile")) return "profile";
        if (fileName.includes("save")) return "save";
        return null;
    }

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

                // Initialize unlocked object for save files if it doesn't exist
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

    function downloadAll() {
        files.forEach((_, index) => download(index));
    }

    function updateFileData(index: number, newData: any) {
        setFiles(prev => prev.map((entry, i) => 
            i === index ? { ...entry, data: newData } : entry
        ));
    }

    const selectedFile = files[selectedIndex];

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
                                            <MetaEditor 
                                                data={selectedFile.data} 
                                                setData={(data: any) => updateFileData(selectedIndex, data)} 
                                            />
                                        }
                                        {selectedFile.type === "profile" && 
                                            <ProfileEditor 
                                                data={selectedFile.data} 
                                                setData={(data: any) => updateFileData(selectedIndex, data)} 
                                            />
                                        }
                                        {selectedFile.type === "save" && 
                                            <SaveEditor 
                                                data={selectedFile.data} 
                                                setData={(data: any) => updateFileData(selectedIndex, data)} 
                                            />
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
