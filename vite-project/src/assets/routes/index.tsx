import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import LayOut from "../pages/LayOut";
import AddItem from "../pages/AddItem";
import EditItem from "../pages/EditItem";
import ShowItemInfo from "../pages/ShowItemInfo";
import Dashboard from "../pages/Dashboard";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";

const Index = () => {
    const router = createBrowserRouter([
        {
            
        path: "/sign-in",
        element: <SignIn />
        },
        {
            path: "/signUp",
            element: <SignUp />
        },
        {
            path: "/dashboard",
            element: <LayOut />,
            children: [
            {
            index: true, 
            element: <Dashboard />
            },
            {
            path: "add-item",
            element: <AddItem />
            },
                {
            path: "edit-item/:id", 
            element: <EditItem />
            },
            {
            path: "show-item/:id", 
            element: <ShowItemInfo />
            }
        ],
    },
    {
        path: "*",
        element: <Navigate to="/sign-in" replace />
        }
    ]);

    return(
        <RouterProvider router={router} />
        )
};

export default Index;