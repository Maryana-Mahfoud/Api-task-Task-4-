import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { IMenuItem } from "../../../Interfaces/sideBar";
import favIcone from "../../../Images/favIcone.svg";
import productIcon from "../../../Images/productIcon.svg";
import person from "../../../Images/person.svg";
import signout from "../../../Images/signout.svg";
import logo from "../../../Images/Logo.svg";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /*state to read data  */
  const [userData] = useState(() => {
    const storedName = localStorage.getItem("user_full_name");
    const storedAvatar = localStorage.getItem("user_avatar");

    return {
      name: storedName || "User Name",
      img: storedAvatar && storedAvatar !== "null" ? storedAvatar : person,
    };
  });


  // array of items to display in the sidebar menu with their paths and icons
  const menuItems: IMenuItem[] = [
    { id: "products", label: "Products", icon: productIcon, path: "/dashboard" },
    { id: "favorites", label: "Favorites", icon: favIcone, path: "/dashboard" },
    { id: "orders", label: "order list", icon: favIcone, path: "/dashboard" },
  ];

  //function to logOut
  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/sign-in"); 
  };

  return (
    <aside className="app-sidebar">
      {/* Logo */}
      <div className="sidebar-logo-container">
        <img src={logo} alt="Logo" />
      </div>

      {/* User Section */}
      <div className="sidebar-user-card">
        <div className="user-avatar-wrapper">
          <img src={userData.img} alt="User Profile" className="user-avatar-img" />
        </div>
        <h3 className="user-profile-name">{userData.name}</h3>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-menu-nav">
        <ul className="sidebar-menu-list">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.id} className="menu-list-item">
                <button
                  className={`menu-tab-btn ${isActive ? "active" : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  <img src={item.icon} alt={item.label} className="menu-icon" />
                  <span className="menu-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Logout */}
      <div className="sidebar-footer-zone">
        <button className="logout-action-btn" onClick={handleLogout}>
          Logout
          <img src={signout} alt="Logout" className="logout-icon" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;