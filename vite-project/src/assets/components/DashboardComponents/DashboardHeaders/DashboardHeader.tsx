import { useState } from "react";
import "./DashboardHeader.css";

interface DashboardHeaderProps {
  onSearch?: (searchTerm: string) => void;
  onAddProductClick?: () => void;
}

const DashboardHeader = ({ onSearch, onAddProductClick }: DashboardHeaderProps) => {
  const [searchValue, setSearchValue] = useState("");
  //search function 
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value); 
    }
  };

  return (
    <div className="dashboard-header-container">
      
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search product by name"
          value={searchValue}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <button className="add-product-btn" onClick={onAddProductClick}>
        ADD NEW PRODUCT
      </button>
    </div>
  );
};

export default DashboardHeader;