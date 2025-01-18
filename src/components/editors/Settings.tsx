import { SettingsData } from "@/types/settings";
import { useState } from "react";
import EditorInput from "../EditorInput";
import Info from "../Info";

export default function SettingsEditor({ data }: { data: SettingsData }) {
    const [settings, setSettings] = useState(data);

    return (<>
        <Info info="Global settings for the game"><h2>Settings</h2></Info>
        <EditorInput label="Version" type="string" setting="version" settings={settings} setSettings={setSettings} />
        <EditorInput label="Language" type="string" setting="language" danger settings={settings} setSettings={setSettings} />
        <EditorInput label="Profile" type="number" setting="profile" danger settings={settings} setSettings={setSettings} />
        <EditorInput label="Reduced Motion" type="checkbox" setting="reduced_motion" settings={settings} setSettings={setSettings} />
        <EditorInput label="High Contrast Cards" type="checkbox" setting="colourblind_option" settings={settings} setSettings={setSettings} />
        <EditorInput label="Crash Reports" type="checkbox" setting="crashreports" settings={settings} setSettings={setSettings} />
        <EditorInput label="Tutorial Complete" type="checkbox" setting="tutorial_complete" settings={settings} setSettings={setSettings} />
        <EditorInput label="Run Stake Stickers" type="checkbox" setting="run_stake_stickers" settings={settings} setSettings={setSettings} />
        <EditorInput label="Game Speed" type="number" setting="GAMESPEED" settings={settings} setSettings={setSettings} />
        <EditorInput label="Screenshake" type="range" setting="screenshake" min={0} max={100} step={1} settings={settings} setSettings={setSettings} />
    
        <h2>Sound</h2>
        <EditorInput label="Master Volume" type="range" setting="SOUND.volume" min={0} max={100} step={1} settings={settings} setSettings={setSettings} />
        <EditorInput label="Music Volume" type="range" setting="SOUND.music_volume" min={0} max={100} step={1} settings={settings} setSettings={setSettings} />
        <EditorInput label="Sound Effect Volume" type="range" setting="SOUND.game_sounds_volume" min={0} max={100} step={1} settings={settings} setSettings={setSettings} />
    
        <h2>Graphics</h2>
        <EditorInput label="CRT" type="range" setting="GRAPHICS.crt" min={0} max={100} step={1} settings={settings} setSettings={setSettings} />
        <EditorInput label="Bloom" type="range" setting="GRAPHICS.bloom" min={1} max={2} step={1} settings={settings} setSettings={setSettings} />
        <EditorInput label="Texture Scaling" type="range" setting="GRAPHICS.texture_scaling" min={1} max={2} step={1} settings={settings} setSettings={setSettings} />
        <EditorInput label="Shadows" type="checkbox" setting="GRAPHICS.shadows" settings={settings} setSettings={setSettings} />
    </>);
}