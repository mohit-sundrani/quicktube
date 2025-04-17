import { Eye, EyeOff, LucideProps } from "lucide-react";
import { useState } from "react";

interface FormInputProps {
    type: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    id: string;
    name: string;
}

const FormInput: React.FC<FormInputProps> = ({ type, value, onChange, Icon, id, name }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <div className="bg-foreground border-body shadow-primary mt-2 flex -translate-1 items-center rounded-xl border px-2">
            <Icon />
            <input
                type={type === "password" ? (showPassword ? "text" : "password") : type}
                onChange={onChange}
                value={value}
                id={id}
                name={name}
                className="h-full w-full bg-transparent px-2 py-3 focus:outline-none"
            />
            {type == "password" ? (
                <button type="button" onClick={togglePasswordVisibility}>
                    {showPassword ? <EyeOff /> : <Eye />}
                </button>
            ) : (
                ""
            )}
        </div>
    );
};

export default FormInput;
