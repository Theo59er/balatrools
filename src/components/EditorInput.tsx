import Input from "./Input";

interface Props<T> {
    type: "checkbox" | "string" | "range" | "number";
    setting: string;
    min?: number;
    max?: number;
    step?: number;
    settings: T;
    label?: string;
    placeholder?: string;
    danger?: boolean;
    setSettings: (settings: T) => void;
}

function updateNestedSetting(settings: any, path: string, value: any): any {
    const keys = path.split(".");
    const lastKey = keys.pop();
    let nested = { ...settings };

    keys.reduce((acc, key) => {
        acc[key] = { ...acc[key] };
        return acc[key];
    }, nested)[lastKey!] = value;

    return nested;
}

function getNestedSetting(settings: any, path: string): any {
    const value = path.split(".").reduce((obj, key) => obj?.[key], settings);
    return value ?? false; // Standardwert für undefined
}

export default function EditorInput<T>({
    label,
    placeholder,
    type,
    setting,
    settings,
    min,
    max,
    step,
    danger,
    setSettings,
}: Props<T>) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        const updatedSettings = updateNestedSetting(
            settings,
            setting,
            type === "number" ? parseFloat(value as string) : value
        );
        setSettings(updatedSettings);
    }

    const currentValue = getNestedSetting(settings, setting);

    return (
        <Input
            type={type}
            label={label && label + (type === "range" ? ` (${currentValue})` : "")}
            placeholder={placeholder}
            value={type === "checkbox" ? undefined : (currentValue ?? "")}
            checked={type === "checkbox" ? Boolean(currentValue) : undefined}
            min={type === "range" ? min : undefined}
            max={type === "range" ? max : undefined}
            step={step ?? (type === "range" ? 1 : undefined)}
            required={danger}
            onChange={handleChange}
        />
    );
}
