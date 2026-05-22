import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/sharedComponents/AuthForm/AuthForm"; 

// Save photo in local storage as base64 string to display it later in the sidebar
const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); 

  // fields configuration for the registration form
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
    
    // fetch Data to the backend
    try {
      
      const imageFile = formData.get("profile_image") as File;
      
      if (imageFile && imageFile.size > 0) {
        const base64Image = await convertImageToBase64(imageFile);
        localStorage.setItem("user_avatar", base64Image);
      } else {
        localStorage.removeItem("user_avatar"); 
      }

      // fetch first name and last name from form data and save it in local storage as well to display it in the sidebar
      const firstName = formData.get("first_name") as string;
      const lastName = formData.get("last_name") as string;
      if (firstName && lastName) {
        localStorage.setItem("user_full_name", `${firstName} ${lastName}`);
      }

      // ✨ تصحيح التكرار: نقوم بإرفاق الصورة بداخل الـ FormData للسيرفر مباشرة دون إعادة تعريف المتغير
      if (imageFile) {
        formData.set("profile_image", imageFile); 
      }

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
        // إذا أرجع السيرفر مصفوفة أخطاء تفصيلية نعرضها، وإلا نعرض الرسالة العامة
        if (result.errors) {
          const detailedErrors = Object.values(result.errors).flat().join(" | ");
          setErrorMessage(detailedErrors);
        } else {
          setErrorMessage(result.message || "Registration failed. Please check your data.");
        }
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
            <h3 className="popup-title">Welcome!</h3>
            <p className="popup-message">Your account has been registered successfully. You can now sign in to access your dashboard.</p>
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