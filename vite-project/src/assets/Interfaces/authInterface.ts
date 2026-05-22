// inerface for the input fileds 
export interface InputField {
    name: string;
    type: string;
    placeholder: string;
    label: string;
    halfWidth?: boolean;
}
 // interface for the props of the form
export interface AuthFormProps {
    type: "signin" | "signup";
    title: string;
    subtitle: string;
    fields: InputField[];
    buttonText: string;
    onSubmit: (formData: FormData) => void; 
    isLoading?: boolean;
    subTitleTwo:string;
}