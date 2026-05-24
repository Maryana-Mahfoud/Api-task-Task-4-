import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import CustomInput from "../components/AddComponents/CustomInput";
import ImageUploader from "../components/AddComponents/ImageUploader";
import FormLayout from "../components/EditComponents/FormLayout"; 
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
  
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupData, setPopupData] = useState<{ text: string; isError: boolean }>({ text: "", isError: false });


  
  const triggerPopup = (text: string, isError: boolean) => {
    setPopupData({ text, isError });
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    if (!popupData.isError) navigate("/dashboard");
  };

  const handleImageSelect = (file: File) => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };


  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  
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

        if (result.image) {
          const baseUrl = "https://dashboard-i552.onrender.com".replace(/\/$/, "");
          const cleanImagePath = result.image.replace(/^\//, "");
          const fullImageUrl = `${baseUrl}/${cleanImagePath}`;
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
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

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
    <>
      <FormLayout
        title="EDIT ITEM"
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        buttonText={isSubmitting ? "Updating..." : "Save"}
        backPath="/dashboard"
      >
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
      </FormLayout>

      {showPopup && (
        <div className="popup-overlay">
          <div className={`popup-box ${popupData.isError ? "popup-error" : "popup-success"}`}>
            <div className="popup-icon-wrapper">
              {popupData.isError ? <FiXCircle className="pop-icon-err" /> : <FiCheckCircle className="pop-icon-success" />}
            </div>
            <h2>{popupData.isError ? "Oops!" : "Success!"}</h2>
            <p>{popupData.text}</p>
            <button type="button" className="popup-close-btn" onClick={handleClosePopup}>
              Ok
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EditItem;