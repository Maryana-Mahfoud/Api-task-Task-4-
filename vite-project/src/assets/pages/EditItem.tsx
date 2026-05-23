import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiXCircle } from "react-icons/fi";
import CustomInput from "../components/AddComponents/CustomInput";
import ImageUploader from "../components/AddComponents/ImageUploader";
import "../components/AddComponents/additems.css";
const EditItem = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // التحكم في الـ Pop-up
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupData, setPopupData] = useState<{ text: string; isError: boolean }>({ text: "", isError: false });

  // 1. function to trigger pop-up with dynamic text and error/success state
  const triggerPopup = (text: string, isError: boolean) => {
    setPopupData({ text, isError });
    setShowPopup(true);
  };

  // 2. function to fetch item data when the page loads
  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://dashboard-i552.onrender.com/api/items/${id}`, {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${token}`, 
            "Accept": "application/json" 
          },
        });

        if (!response.ok) throw new Error("Failed to load item data.");

        const result = await response.json();
        setName(result.name);
        setPrice(result.price.toString());

        //  image condiations
        if (result.image) {
          const fullImageUrl = result.image.startsWith("http")
            ? result.image
            : `https://dashboard-i552.onrender.com/${result.image}`;
          setImagePreview(fullImageUrl);
        } else if (result.image_url) {
          setImagePreview(result.image_url);
        }

      } catch (error: unknown) {
        if (error instanceof Error) triggerPopup(error.message, true);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchItemData();
    }
  }, [id]);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    if (!popupData.isError) navigate("/dashboard");
  };

  // 3. function to handle form submission and update item data
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
      formData.append("_method", "PUT"); 
      
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(`https://dashboard-i552.onrender.com/api/items/${id}`, {
        method: "POST", 
        headers: { 
          "Authorization": `Bearer ${token}`, 
          "Accept": "application/json" 
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Update failed. Please try again.");

      triggerPopup("Item updated successfully!", false);
      setTimeout(() => navigate("/dashboard"), 1500);

    } catch (error: unknown) {
      if (error instanceof Error) triggerPopup(error.message, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "100px", color: "#666" }}>
        <h3>Loading Item Data, please wait...</h3>
      </div>
    );
  }

  return (
    <div className="add-item-page">
      <button type="button" className="back-btn" onClick={() => navigate("/dashboard")}>
        <FiArrowLeft /> Back
      </button>
      
      <form onSubmit={handleSubmit} className="add-item-form">
        <h2>EDIT ITEM</h2>
        
        <div className="form-content">
          <div className="inputs-section">
            <CustomInput 
              label="Name" 
              type="text"
              value={name} 
              onChange={setName} 
              placeholder="Enter product name" 
            />
            <CustomInput 
              label="Price" 
              type="number"
              value={price} 
              onChange={setPrice} 
              placeholder="Enter product price" 
            />
          </div>

          <div className="uploader-section">
            <ImageUploader 
              label="Image" 
              imagePreview={imagePreview} 
              onImageSelect={handleImageSelect} 
            />
          </div>
        </div>

        <button type="submit" className="save-btn" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Save"}
        </button>
      </form>

      {/*  Pop-up */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card animated-shake">
            <div className="popup-icon-box" style={{ backgroundColor: popupData.isError ? "#e60000" : "#00cc66" }}>
              {popupData.isError ? <FiXCircle /> : <FiCheckCircle />}
            </div>
            <h3 className="popup-title" style={{ color: popupData.isError ? "#e60000" : "#00cc66" }}>
              {popupData.isError ? "Update Failed" : "Success"}
            </h3>
            <p className="popup-message">{popupData.text}</p>
            <button type="button" className="popup-btn" style={{ backgroundColor: popupData.isError ? "#e60000" : "#00cc66" }} onClick={handleClosePopup}>
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditItem;