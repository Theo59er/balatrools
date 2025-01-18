import { useState } from "react";
import Button from "./Button";

export default function FileInput(props: React.InputHTMLAttributes<HTMLInputElement> & { onFileChange?: (file: File | null) => void }) {
    const [file, setFile] = useState<File | null>(null);
    
    function onClick() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".jkr";
        input.onchange = () => {
            const file = input.files?.item(0);
            if (file) {
                setFile(file);
                props.onFileChange?.(file);
            }
        };
        input.click();
    }
    
    return (
        <div className="flex flex-col gap-2 bg-bg-1">
            <Button onClick={onClick}>{file ? file.name : "Choose File"}</Button>
        </div>
    )
}