import { useState } from "react";
import Info from "../Info";
import Button from "../Button";

export default function JsonEditor({ data, setData }: { data: any, setData: (data: any) => void }) {
    const [jsonContent, setJsonContent] = useState<string>(JSON.stringify(data, null, 2));
    const [error, setError] = useState<string>("");

    const updateData = () => {
        try {
            const newData = JSON.parse(jsonContent);
            setData(newData);
            setError("");
        } catch (e) {
            setError("Ungültiges JSON Format");
        }
    };

    return (<>
        <Info info="Rohe JSON-Datei bearbeiten. Seien Sie vorsichtig!">
            <h2>JSON Editor</h2>
        </Info>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex flex-col gap-2">
            <textarea
                className="w-full h-[600px] font-mono text-sm p-2 bg-bg-2"
                value={jsonContent}
                onChange={(e) => setJsonContent(e.target.value)}
            />
            <Button onClick={updateData}>Speichern</Button>
        </div>
    </>);
}