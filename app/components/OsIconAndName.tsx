import { FaWindows, FaApple, FaLinux, FaAndroid, FaMobileAlt } from "react-icons/fa";

export default function osNameToIcon(osName?: string | null) {
    if (!osName) return <FaMobileAlt />; // fallback icon

    switch (osName.toLowerCase()) {
        case "windows":
            return <span className="flex items-center gap-1"><FaWindows /> Windows</span>;
        case "macos":
        case "mac":
            return <span className="flex items-center gap-1"><FaApple /> MacOS</span>;
        case "linux":
            return <span className="flex items-center gap-1"><FaLinux /> Linux</span>;
        case "android":
            return <span className="flex items-center gap-1"><FaAndroid /> Android</span>;
        case "ios":
            return <span className="flex items-center gap-1"><FaMobileAlt /> iOS</span>;
        default:
            return <FaMobileAlt />; // generic fallback
    }
}