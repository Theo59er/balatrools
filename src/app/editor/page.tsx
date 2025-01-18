"use client";

import Button from "@/components/Button";
import ProfileEditor from "@/components/editors/Profile";
import SettingsEditor from "@/components/editors/Settings";
import FileInput from "@/components/FileInput";
import Subtext from "@/components/Subtext";
import { processFile } from "@/lib/jkrFile";
import { useEffect, useState } from "react";

export default function EditorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<any>(null);
  const [fileType, setFileType] = useState<"settings" | "meta" | "profile" | "save" | null>(null);

  useEffect(() => {
    if (!file) return;

    if (file.name.includes("settings"))
      setFileType("settings");
    else if (file.name.includes("meta"))
      setFileType("meta");
    else if (file.name.includes("profile"))
      setFileType("profile");
    else if (file.name.includes("save"))
      setFileType("save");
    else
      setFileType(null);

    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      const data = new Uint8Array(buffer);

      setFileData(processFile(data));
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  function download() {
    console.log(fileData);
    // const blob = new Blob([fileData], { type: "octect/stream" });
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.style.display = "none";
    // a.href = url;
    // a.download = file.name;
    // document.body.appendChild(a);
    // a.click();
    // window.URL.revokeObjectURL(url);
  }

  return (
    <main className="absolute-center h-full p-5 py-10 w-[50%] flex flex-col gap-2">
      <h1>Balatro Save Editor</h1>
      <Subtext>Save files (.jkr) can be found at:{"\n"}
        - Windows: %APPDATA%/Balatro{"\n"}
        - Linux: [steam path]/compat-data/2379780/pfx/drive_c/users/steamuser/AppData/Roaming/Balatro/{"\n"}
        - Mac: /Users/[user]/Library/Application Support/Balatro/
      </Subtext>
      <FileInput onFileChange={setFile} />
      {(file && !fileType) && <p>Unknown file type (make sure that the name includes `settings`, `meta`, `profile`, or `save` depending on the type)</p>}
      {(file && !fileData) && <p>There was an error parsing the file data, see console for more info</p>}
      
      {(file && fileData) && <div className="bg-bg-2 p-2 rounded-lg flex flex-col gap-2">
        <Subtext>Settings marked with <span className="text-red-500">*</span> could damage your save if modified incorrectly</Subtext>
        {fileType === "settings" && <SettingsEditor data={fileData} />}
        {/* {fileType === "meta" && <SettingsEditor data={fileData} />} */}
        {fileType === "profile" && <ProfileEditor data={fileData} />}
        {/* {fileType === "save" && <SettingsEditor data={fileData} />} */}
      </div>}
      {(file && fileData) && <Button onClick={download} className="w-full">Download</Button>}
    </main>
  )
}
