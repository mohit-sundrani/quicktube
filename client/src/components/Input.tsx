interface InputProps {
    inputPlaceholder: string;
    buttonText: string;
    ButtonIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    name: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ inputPlaceholder, buttonText, ButtonIcon, name, onChange }) => {
    return (
        <div className="border-body bg-foreground text-body shadow-primary mt-1 flex h-13 w-3xl min-w-fit -translate-1 items-center rounded-xl border-1">
            <input
                type="text"
                placeholder={inputPlaceholder}
                className="h-full w-full items-center px-3 focus:outline-none"
                name={name}
                onChange={onChange}
                autoComplete="off"
                required
            />
            <button
                type="submit"
                className="bg-primary text-body border-body flex h-full cursor-pointer items-center justify-center rounded-r-xl border-l-1 px-3 py-2 text-center">
                {buttonText} <ButtonIcon className="h-4" />
            </button>
        </div>
    );
};

export default Input;
