import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiXCircle } from "react-icons/fi"; 
import CustomInput from "../components/AddComponents/CustomInput";
import ImageUploader from "../components/AddComponents/ImageUploader";
import "../components/AddComponents/additems.css";

const AddItem = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupData, setPopupData] = useState<{ text: string; isError: boolean }>({ text: "", isError: false });

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const triggerPopup = (text: string, isError: boolean) => {
    setPopupData({ text, isError });
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    if (!popupData.isError) {
      navigate("/dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim()) {
      triggerPopup("Please fill in all required fields.", true);
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      if (imageFile) formData.append("image", imageFile);

      const response = await fetch("https://dashboard-i552.onrender.com/api/items", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to add item.");

      triggerPopup("Item added successfully!", false);
      
      setTimeout(() => {
        setShowPopup(false);
        navigate("/dashboard");
      }, 2000);

    } catch (error: unknown) {
      if (error instanceof Error) {
        triggerPopup(error.message, true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-item-page-wrapper">
      <div className="add-item-container">
        
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <FiArrowLeft />
        </button>

        <h1 className="add-item-title">ADD NEW ITEM</h1>

        <form onSubmit={handleSubmit} className="add-item-form-grid">
          <div className="inputs-section">
            <CustomInput label="Name" type="text" placeholder="Enter product name" value={name} onChange={setName} />
            <CustomInput label="Price" type="number" placeholder="Enter product price" value={price} onChange={setPrice} />
          </div>

          <div className="uploader-section">
            <ImageUploader label="Image" imagePreview={imagePreview} onImageSelect={handleImageSelect} />
          </div>

          <div className="form-submit-row">
            <button type="submit" disabled={isSubmitting} className="save-item-btn">
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* ==================== الـ Pop-up المخصص ==================== */}
      {showPopup && (
        <div className="popup-overlay">
          <div className={`popup-box ${popupData.isError ? "popup-error" : "popup-success"}`}>
            <div className="popup-icon-wrapper">
              {popupData.isError ? <FiXCircle className="pop-icon-err" /> : <FiCheckCircle className="pop-icon-success" />}
            </div>
            <h2>{popupData.isError ? "Oops!" : "Success!"}</h2>
            <p>{popupData.text}</p>
            <button className="popup-close-btn" onClick={handleClosePopup}>
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddItem;