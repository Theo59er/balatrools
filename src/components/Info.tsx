import { InfoIcon } from "lucide-react";
import React, { useState } from "react";

export default function Info({ children, info, className, noIcon }: { children: React.ReactNode, info: React.ReactNode, className?: string, noIcon?: boolean }) {
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);

    function handleMouseMove(e: React.MouseEvent) {
        // take into account the absolute offset of the parent element
        const parentOffset = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setMouseX(e.clientX - parentOffset.left + 20);
        setMouseY(e.clientY - parentOffset.top);
    }

    // renders the children + a little info icon that shows the text on hover at the mouse cursor position
    return (<div className="relative group flex flex-row gap-1 items-center" onMouseMove={handleMouseMove}>
        <div className={className}>
            {children}
        </div>

        {!noIcon && <InfoIcon className="text-primary ml-1" size={16} />}

        <div inert className="absolute invisible group-hover:visible bg-bg-4 text-white text-sm rounded p-2 z-10"
            style={{ left: mouseX, top: mouseY, width: '300px' }}>
            {info}
        </div>
    </div>);
}