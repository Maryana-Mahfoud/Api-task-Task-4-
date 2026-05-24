import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./FormLayout.css";

interface FormLayoutProps {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  buttonText: string;
  children: React.ReactNode;
  backPath?: string; 
}

const FormLayout = ({ title, onSubmit, isSubmitting, buttonText, children, backPath }: FormLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="form-page-container">
      
      <button 
        type="button" 
        className="form-back-btn" 
        onClick={() => backPath ? navigate(backPath) : navigate(-1)}
      >
        <FiArrowLeft /> Back
      </button>
      
      
      <form onSubmit={onSubmit} className="shared-form-card">
        <h2 className="shared-form-title">{title}</h2>
        
        
        <div className="shared-form-body">
          {children}
        </div>

        
        <button type="submit" className="shared-form-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : buttonText}
        </button>
      </form>
    </div>
  );
};

export default FormLayout;