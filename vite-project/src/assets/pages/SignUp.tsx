import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/sharedComponents/AuthForm/AuthForm"; 

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null); 
  {/*fields configuration for the registration form */ }
  const registerFields = [
    { name: "first_name", type: "text", placeholder: "First Name", label: "First Name", halfWidth: true },
    { name: "last_name", type: "text", placeholder: "Last Name", label: "Last Name", halfWidth: true },
    { name: "user_name", type: "text", placeholder: "User Name", label: "User Name", halfWidth: false },
    { name: "email", type: "email", placeholder: "Enter your email", label: "Email", halfWidth: false },
    { name: "password", type: "password", placeholder: "Enter password", label: "Password", halfWidth: true },
    { name: "password_confirmation", type: "password", placeholder: "Re-enter password", label: "Re-enter password", halfWidth: true },
  ];

  const handleRegisterSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setErrorMessage(null); 
    {/*fetch Data to the backend */ }
    try {
      const response = await fetch("https://dashboard-i552.onrender.com/api/register", {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setShowSuccessPopup(true); 
      } else {
        
        setErrorMessage(result.message || "Registration failed. Please check your data.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Something went wrong. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthForm
        type="signup"
        title="SIGN UP"
        subtitle="Fill in the following fields to create an account."
        fields={registerFields}
        buttonText="Sign Up"
        onSubmit={handleRegisterSubmit}
        isLoading={isLoading}
        subTitleTwo="Do you have an account? Sign in"
      />

      
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-card animated-bounce">
            <div className="popup-icon-box" style={{ backgroundColor: '#4CAF50' }}>✓</div>
            <h3 className="popup-title">Welcome Back!</h3>
            <p className="popup-message">Your account has been registered successfully
              You can now sign in to access your dashboard....</p>
            <button 
              className="popup-btn"
              onClick={() => {
                setShowSuccessPopup(false);
                navigate("/sign-in");
              }}
            >
              Go to Sign In
            </button>
          </div>
        </div>
      )}

      
      {errorMessage && (
        <div className="popup-overlay">
          <div className="popup-card animated-shake">
            <div className="popup-icon-box" style={{ backgroundColor: "var(--danger-color)" }}>✕</div>
            <h3 className="popup-title" style={{ color: "var(--danger-color)" }}>Registration Failed</h3>
            <p className="popup-message">{errorMessage}</p>
            <button 
              className="popup-btn"
              style={{ backgroundColor: "var(--danger-color)" }}
              onClick={() => setErrorMessage(null)} 
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;