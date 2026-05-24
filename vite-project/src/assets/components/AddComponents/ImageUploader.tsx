import React, { useRef } from "react";
import { FiUploadCloud } from "react-icons/fi";
import "./additems.css"; 

interface ImageUploaderProps {
    label: string;
    imagePreview: string | null;
    onImageSelect: (file: File) => void;
}

const ImageUploader = ({ label, imagePreview, onImageSelect }: ImageUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageSelect(e.target.files[0]);
        }
    };

    return (
        <div className="image-upload-section">
            <label>{label}</label>
        
            <div className="upload-dropzone" onClick={() => fileInputRef.current?.click()}>
                {imagePreview ? (
                    
                    <img src={imagePreview} alt="Preview" className="image-preview-img" />
                ) : (
                    <>
                        
                        <FiUploadCloud className="upload-icon" />
                        <span className="upload-text">Click to upload product image</span>
                    </>
                )}
            </div>

            <input 
                type="file" 
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }} 
            />
        </div>
    );
};

export default ImageUploader;