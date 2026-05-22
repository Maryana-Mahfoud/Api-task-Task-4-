import { Outlet } from "react-router-dom"

import Sidebar from "../components/sharedComponents/Sidebar/Sidebar"

const layOut = () => {
    return (
        <>
        
            
            <Sidebar />
            <main>
                <Outlet /> 
            </main>
        
        </>
    )
}

export default layOut
