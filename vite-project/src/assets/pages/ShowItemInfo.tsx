import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { GiSandsOfTime } from "react-icons/gi";
import type { IProduct } from "../Interfaces/productInterface"; 
import ShowItemImage from "../components/ShowItem/ShowItemImage";
import ShowItemDetails from "../components/ShowItem/ShowItemDetails";
import "../components/ShowItem/ShowItem.css"

const ShowItemInfo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        const response = await fetch(`https://dashboard-i552.onrender.com/api/items/${id}`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to load product details.");
        
        const result = await response.json();
        setProduct(result);
      } catch (error: unknown) {
        if (error instanceof Error) setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProductDetails();
  }, [id]);

  // path normalization and validation for image URL
  const productData = product as Record<string, unknown> | null;
  const rawImagePath = productData?.image_url || productData?.image;
  
  let imageUrl = "https://via.placeholder.com/350"; 

  if (rawImagePath && typeof rawImagePath === "string") {
    let trimmedPath = rawImagePath.trim();
    
    if (trimmedPath.startsWith("http://")) {
      trimmedPath = trimmedPath.replace("http://", "https://");
    }
    
    if (trimmedPath.startsWith("https://")) {
      imageUrl = trimmedPath;
    } else {
      const baseUrl = "https://dashboard-i552.onrender.com".replace(/\/$/, "");
      const cleanImagePath = trimmedPath.replace(/^\//, "");
      imageUrl = `${baseUrl}/${cleanImagePath}`;
    }
  }

  if (isLoading) {
    return (
      <div className="loading-container-center">
        <GiSandsOfTime className="loading-icon-spin" />
        <p>Fetching details...</p>
      </div>
    );
  }

  if (errorMessage || !product) {
    return (
      <div className="error-container-center">
        <p>{errorMessage || "Product not found."}</p>
        <button onClick={() => navigate("/dashboard")} className="back-circle-btn">Back</button>
      </div>
    );
  }

  return (
    <div className="show-item-page-container">
      
      <button className="back-circle-btn" onClick={() => navigate("/dashboard")} title="Go Back">
        <FiArrowLeft size={18} />
      </button>

      
      <div className="show-item-card-wrapper">
        <h1 className="show-item-main-title">{product.name}</h1>

        <div className="show-item-layout-grid">
          
          <ShowItemImage imageUrl={imageUrl} altText={product.name} />
          
          
          <ShowItemDetails 
            price={product.price} 
            createdAt={product.created_at} 
            updatedAt={product.updated_at} 
          />
        </div>
      </div>
    </div>
  );
};

export default ShowItemInfo;