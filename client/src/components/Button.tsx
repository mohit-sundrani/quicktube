import { LucideProps } from "lucide-react";
import React from "react";

interface Button {
    type: "submit" | "reset" | "button" | undefined;
    style: "primary" | "secondary";
    text: string;
    Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    onClick?: () => void;
}

const Button: React.FC<Button> = ({ type, style, text, Icon, onClick }) => {
    return (
        <button className={style == "primary" ? "primary-button" : "secondary-button"} type={type} onClick={onClick}>
            {text} <Icon className="h-4" scale={0.5} />
        </button>
    );
};

export default Button;
