import React from "react";
import { FaChrome, FaFirefoxBrowser, FaSafari, FaEdge, FaOpera, FaInternetExplorer } from "react-icons/fa";

function browserNameToIcon(browserName?: string | null) {
    if (!browserName) return <FaChrome />; // fallback

    switch (browserName.toLowerCase()) {
        case "chrome":
            return <FaChrome />;
        case "firefox":
            return <FaFirefoxBrowser />;
        case "safari":
            return <FaSafari />;
        case "edge":
            return <FaEdge />;
        case "opera":
            return <FaOpera />;
        case "ie":
        case "internet explorer":
            return <FaInternetExplorer />;
        default:
            return <FaChrome />; // fallback
    }
}

// Usage
export const BrowserIcon: React.FC<{ name?: string | null }> = ({ name }) => (
    <div className="flex items-center gap-1">
        {browserNameToIcon(name)}
        <span>{name || "Unknown"}</span>
    </div>
);