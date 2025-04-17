interface Select {
    name: string;
    options: string[] | number[];
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    value: string | number;
}

const Select: React.FC<Select> = ({ name, options, onChange, value }) => {
    return (
        <select name={name} onChange={onChange} value={value}>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};

export default Select;
