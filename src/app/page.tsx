import { LucideProps, Save } from "lucide-react";
import { IconType } from "react-icons";
import { GiCardJoker } from "react-icons/gi";

function ToolCard({ name, description, Icon, href }: { name: string; description: string, Icon: React.FC<LucideProps> | IconType, href: string }) {
    return (
    <a href={href} className="flex flex-row gap-4 items-center bg-primary-1 hover:bg-primary-2 p-4 rounded-lg shadow cursor-pointer">
        <Icon size={48} />
        <div className="flex flex-col gap-2">
            <h3>{name}</h3>
            <p className="text-sm font-thin">{description}</p>
        </div>
    </a>);
}

export default function Home() {
    return (<div className="absolute-center w-1/2">
        <h1 className="text-white">Balatrools</h1>
        <h2 className="text-white">Tools and resources for Balatro</h2>
        <div className="flex flex-col gap-4 w-full">
            <ToolCard name="Save Editor" description="Edit the various save files in Balatro" Icon={Save} href="/editor" />
            <ToolCard name="Jokers" description="View all jokers and synergies" Icon={GiCardJoker} href="/jokers" />
        </div>
    </div>)
}