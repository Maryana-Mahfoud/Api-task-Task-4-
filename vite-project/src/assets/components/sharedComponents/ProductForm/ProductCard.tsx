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

    const productImage = product.image_url && product.image_url.trim() !== "" 
        ? product.image_url 
        : DEFAULT_IMAGE;

    return (
        <div className="product-card">
            <div className="product-img-container">
                <img 
                    src={productImage} 
                    alt={product.name} 
                    className="product-img"
                    style={{
                        width: "100%",
                        height: "180px",       
                        objectFit: "contain",  
                        padding: product.image_url && product.image_url.trim() !== "" ? "0" : "15px" 
                    }}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = DEFAULT_IMAGE;
                        target.style.padding = "15px"; 
                    }}
                />
                
                {/*overlay*/}
                <div className="product-overlay">
                    <h3 className="product-name-overlay">{product.name}</h3>
                    <div className="product-actions">
                        <button className="btn-action edit-btn" onClick={() => onEditClick(product)}>
                            Edit
                        </button>
                        <button className="btn-action delete-btn" onClick={() => onDeleteClick(product)}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;