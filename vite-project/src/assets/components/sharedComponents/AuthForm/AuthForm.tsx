import { useState } from "react";
import type { AuthFormProps } from "../../../Interfaces/authInterface"; 
import logo from "../../../Images/Logo.svg";
import uploadIcn from "../../../Images/Upload icon.svg";
import "./AuthForm.css";
import { Link } from "react-router-dom";

const AuthForm = ({ type, title, subtitle, fields, buttonText, onSubmit, isLoading }: AuthFormProps) => {
    /* default value for image */
    const [profileImage, setProfileImage] = useState<File | null>(null);

    /* create new form DATA */
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        
        if (type === "signup" && profileImage) {
            data.append("profile_image", profileImage);
        }
        onSubmit(data);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Header Section with logo, title, and subtitle */}
                <div className="auth-header">
                    <img className="auth-logo-img" src={logo} alt="focal X" />
                    <h2 className="auth-title">{title}</h2>
                    <p className="auth-subtitle">{subtitle}</p>
                </div>

                {/* form section */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="fields-grid">
                        {fields.map((field) => (
                            <div 
                                className={`form-group ${field.halfWidth ? "half-width" : "full-width"}`} 
                                key={field.name}
                            >
                                <label className="form-label" htmlFor={field.name}>{field.label}</label>
                                <input
                                    id={field.name}
                                    type={field.type}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    className="form-input"
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    {type === "signup" && (
                        <div className="form-group full-width">
                            <label className="form-label">Profile Image</label>
                            <div className="image-upload-box">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => e.target.files && setProfileImage(e.target.files[0])}
                                    style={{ position: 'absolute', opacity: 0, cursor: 'pointer', width: '100%', height: '100%', zIndex: 2 }}
                                />
                                {profileImage ? (
                                    <>
                                        <img src={URL.createObjectURL(profileImage)} alt="Preview" className="image-preview" />
                                        <button 
                                            type="button" 
                                            className="image-remove-btn"
                                            onClick={(e) => { e.stopPropagation(); setProfileImage(null); }}
                                        >
                                            X
                                        </button>
                                    </>
                                ) : (
                                    <div className="upload-placeholder">
                                        <img className="upload-icon" src={uploadIcn} alt="Upload Icon" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? "Loading..." : buttonText}
                    </button>
                    
                    <div className="auth-footer">
                        {type === "signin" ? (
                            <>
                                Don't have an account?{" "}
                                <Link to="/signup" className="auth-link">Create one</Link>
                            </>
                        ) : (
                            <>
                                Do you have an account?{" "}
                                <Link to="/sign-in" className="auth-link">Sign in</Link> 
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthForm;