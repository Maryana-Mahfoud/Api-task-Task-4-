
import "./additems.css"; 

interface CustomInputProps {
    label: string;
    type: "text" | "number" | "password" | "email";
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

const CustomInput = ({ label, type, placeholder, value, onChange }: CustomInputProps) => {
    return (
        <div className="form-group" >
            <label>{label}</label>
            <input 
                type={type} 
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default CustomInput;