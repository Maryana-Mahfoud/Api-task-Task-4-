import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/sharedComponents/AuthForm/AuthForm";
import person from "../Images/person.svg";
import type { InputField } from "../Interfaces/authInterface"; 

const SignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  /* popUp for success or error */
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  /* fields for login form */
  const loginFields: InputField[] = [
    { name: "email", type: "email", placeholder: "Enter your email", label: "Email" },
    { name: "password", type: "password", placeholder: "Enter your password", label: "Password" },
  ];

  const handleLoginSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setErrorMessage(null); 
    
    /* fetch request to login endpoint */
    try {
      const response = await fetch("https://dashboard-i552.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        body: formData, 
      });

      const result = await response.json();
      
      /* handle success response */
      if (response.ok) {
        console.log("Login Success:", result);
        
        /* store token in localStorage for authenticated requests */
        if (result.token) {
          localStorage.setItem("token", result.token);
        }

        /* store user information in localStorage */
        if (result.user) {
          const firstName = result.user.first_name;
          const lastName = result.user.last_name;
          if (firstName) {
            localStorage.setItem("user_full_name", `${firstName} ${lastName || ""}`.trim());
          }
          if (result.user.profile_image && result.user.profile_image !== "null") {
            localStorage.setItem("user_avatar", result.user.profile_image);
          }
        }

        /* show success pop-up */
        setShowSuccessPopup(true);
        
        /* show success pop-up for 2 seconds, then redirect to dashboard */
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate("/dashboard"); 
        }, 2000);

      } else {
        if (result.errors) {
          const detailedErrors = Object.values(result.errors).flat().join(" | ");
          setErrorMessage(detailedErrors);
        } else {
          setErrorMessage(result.message || "Invalid email or password. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Network error! Please check your internet connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthForm
        type="signin"
        title="SIGN IN"
        subtitle="Enter your credentials to access your account"
        fields={loginFields}
        buttonText="Sign In"
        onSubmit={handleLoginSubmit}
        isLoading={isLoading}
        subTitleTwo="Don't have an account?"
      />

      {/* popUp in error case */}
      {errorMessage && (
        <div className="popup-overlay">
          <div className="popup-card animated-shake">
            <div className="popup-icon-box" style={{ backgroundColor: '#E53E3E', color: '#fff' }}>✕</div>
            <h3 className="popup-title" style={{ color: '#E53E3E' }}>Login Failed</h3>
            <p className="popup-message">{errorMessage}</p>
            <button 
              className="popup-btn" 
              style={{ backgroundColor: '#E53E3E', marginTop: '20px' }}
              onClick={() => setErrorMessage(null)}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* popUp for success case */}
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-card animated-bounce">
            <div className="popup-icon-box" style={{ backgroundColor: '#4CAF50' }}>✓</div>
            <h3 className="popup-title">Welcome Back!</h3>
            <p className="popup-message">Login successful. Redirecting you to your dashboard...</p>
            <button 
              className="popup-btn"
              onClick={() => {
                setShowSuccessPopup(false);
                navigate("/dashboard"); 
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SignIn;