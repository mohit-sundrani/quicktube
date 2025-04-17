/*
	Installed from https://reactbits.dev/ts/tailwind/
*/

import React from "react";

interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = "" }) => {
    const animationDuration = `${speed}s`;

    return (
        <div
            className={`inline-block bg-clip-text text-[#9ceaf280] ${disabled ? "" : "animate-shine"} ${className}`}
            style={{
                backgroundImage: "linear-gradient(120deg, #2f4b52 40%, #2f4b5290 50%, #2f4b52 60%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                animationDuration: animationDuration,
            }}>
            {text}
        </div>
    );
};

export default ShinyText;

// tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       keyframes: {
//         shine: {
//           '0%': { 'background-position': '100%' },
//           '100%': { 'background-position': '-100%' },
//         },
//       },
//       animation: {
//         shine: 'shine 5s linear infinite',
//       },
//     },
//   },
//   plugins: [],
// };
