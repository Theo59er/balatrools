import { useState } from "react";
import Button from "./Button";

export default function FileInput(props: React.InputHTMLAttributes<HTMLInputElement> &
    { onFileChange?: (files: File[]) => void }) {
    const [files, setFiles] = useState<File[]>([]);

    function onClick() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".jkr";
        input.multiple = true;
        input.onchange = () => {
            const selectedFiles = Array.from(input.files || []);
            if (selectedFiles.length > 0) {
                setFiles(selectedFiles);
                props.onFileChange?.(selectedFiles);
            }
        };
        input.click();
    }

    return (
        <div className="flex flex-col gap-2 bg-bg-1">
            <Button onClick={onClick}>
                {files.length > 0 
                    ? `${files.length} file${files.length > 1 ? 's' : ''} selected`
                    : "Choose Files"}
            </Button>
            {files.length > 0 && (
                <div className="text-sm text-gray-400 px-2">
                    {files.map(file => (
                        <div key={file.name}>{file.name}</div>
                    ))}
                </div>
            )}
        </div>
    );
}
