import { useNavigate } from "react-router-dom"; 
import type { IProduct } from "../../../Interfaces/productInterface";
import "./ProductCard.css";
import Iphone from "../../../Images/Iphone.svg";

interface ProductCardProps {
    product: IProduct;
    onDeleteClick: (product: IProduct) => void;
    onEditClick: (product: IProduct) => void;
}

const DEFAULT_IMAGE = Iphone; 

const ProductCard = ({ product, onDeleteClick, onEditClick }: ProductCardProps) => {
    const navigate = useNavigate(); 

    
    const rawImage = product.image_url || product.image;

    const productImage = rawImage && rawImage.trim() !== "" 
        ? (rawImage.startsWith("http") ? rawImage : `https://dashboard-i552.onrender.com/images/${rawImage}`)
        : DEFAULT_IMAGE;

    const handleCardClick = () => {
        navigate(`/dashboard/show-item/${product.id}`); 
    };

    return (
        <div className="product-card">
            <div className="product-img-container" onClick={handleCardClick} style={{ cursor: "pointer" }}>
                <img 
                    src={productImage} 
                    alt={product.name} 
                    className="product-img"
                    style={{
                        width: "100%",
                        height: "180px",       
                        objectFit: "contain",  
                        padding: rawImage && rawImage.trim() !== "" ? "0" : "15px" 
                    }}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = DEFAULT_IMAGE;
                        target.style.padding = "15px"; 
                    }}
                />
                
                <div className="product-overlay">
                    <h3 className="product-name-overlay">{product.name}</h3>
                    <div className="product-actions">
                        <button 
                            className="btn-action edit-btn" 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                onEditClick(product); 
                            }}
                        >
                            Edit
                        </button>
                        <button 
                            className="btn-action delete-btn" 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                onDeleteClick(product); 
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;