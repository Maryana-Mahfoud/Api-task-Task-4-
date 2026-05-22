import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/sharedComponents/Sidebar/Sidebar"; 

const LayOut = () => {
    {/*check if token exists in local storage */}
    const token = localStorage.getItem("token");
    {/* if no token, redirect to sign-in page */}
    if (!token) {
        return <Navigate to="/sign-in" replace />;
    }

    return (
        <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
        
        <Sidebar />
            <main style={{ flex: 1, marginLeft: "260px", backgroundColor: "#FFFFFF" }}>
            <Outlet />
        </main>
    </div>
    );
};

export default LayOut;