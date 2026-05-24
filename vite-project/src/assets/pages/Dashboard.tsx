import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import type { IProduct } from "../Interfaces/productInterface";
import DashboardHeader from "../components/DashboardComponents/DashboardHeaders/DashboardHeader";
import ProductCard from "../components/sharedComponents/ProductForm/ProductCard";
import Pagination from "../components/sharedComponents/Pagination/Pagination"; 
import { GiSandsOfTime } from "react-icons/gi";

const Dashboard = () => {
  const navigate = useNavigate(); 

  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]); 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  //variable to manage pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8; 

  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);

  // fetching products from the backend API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true); 
        const token = localStorage.getItem("token");
        const response = await fetch("https://dashboard-i552.onrender.com/api/items", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch products.");
        const result = await response.json();
        setProducts(result);
        setFilteredProducts(result);
      } catch (error: unknown) {
        if (error instanceof Error) setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // function to handle search input changes and filter products accordingly
  const handleSearch = (searchTerm: string) => {
    setCurrentPage(1); 
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredProducts(filtered);
  };

  const handleAddProductClick = () => {
    navigate("/dashboard/add-item"); 
  };

  const handleEditProductClick = (product: IProduct) => {
    navigate(`/dashboard/edit-item/${product.id}`);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://dashboard-i552.onrender.com/api/items/${productToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the product. Please try again.");
      }

      const updatedProducts = products.filter((p) => p.id !== productToDelete.id);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setProductToDelete(null);
      
      // less totalPage number
      const newTotalPages = Math.ceil(updatedProducts.length / itemsPerPage);
      if (currentPage > newTotalPages && currentPage > 1) {
        setCurrentPage(newTotalPages);
      }

    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const currentProductsToShow = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="dashboard-page-content" style={{ padding: "30px", width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      <DashboardHeader onSearch={handleSearch} onAddProductClick={handleAddProductClick} />

      {isLoading ? (
        <div className="loading-container" style={{ textAlign: "center", padding: "80px 20px", flex: 1 }}>
          <GiSandsOfTime style={{ fontSize: "120px", color: "#f2a700", marginBottom: "20px", animation: "spin 2s linear infinite" }} />
          <p style={{ color: "#666" }}>Loading products, please wait...</p>
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          
          <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "25px", marginTop: "20px" }}>
            {currentProductsToShow.length > 0 ? (
              currentProductsToShow.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onEditClick={handleEditProductClick}
                  onDeleteClick={(prod) => setProductToDelete(prod)} 
                />
              ))
            ) : (
              <div className="no-products-box" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#888" }}>
                <p>No products available to show.</p>
              </div>
            )}
          </div>

          
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={(page) => setCurrentPage(page)} 
            />
          )}
        </div>
      )}

      
      {productToDelete && (
        <div className="delete-popup-overlay">
          <div className="delete-popup-card">
            <h3 className="delete-popup-title">ARE YOU SURE YOU WANT TO DELETE THE PRODUCT?</h3>
            <div className="delete-popup-buttons">
              <button className="delete-btn-yes" onClick={handleConfirmDelete}>Yes</button>
              <button className="delete-btn-no" onClick={() => setProductToDelete(null)}>No</button>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="popup-overlay">
          <div className="popup-card animated-shake">
            <div className="popup-icon-box" style={{ backgroundColor: "#e60000" }}>✕</div>
            <h3 className="popup-title" style={{ color: "#e60000" }}>Fetch Failed</h3>
            <p className="popup-message">{errorMessage}</p>
            <button className="popup-btn" style={{ backgroundColor: "#e60000" }} onClick={() => setErrorMessage(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;