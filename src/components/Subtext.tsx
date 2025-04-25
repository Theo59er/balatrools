export default function Subtext({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <p className={`text-sm text-gray-500 whitespace-pre-wrap ${className ?? ""}`}>
            {children}
        </p>
    );
}
