import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home';
import SellerDashboard from './pages/SellerDashboard';
import SellerProductManagement from './pages/SellerProductManagement';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
    {
    path: "/seller",
    element: <SellerDashboard/>,
  },
  {
    path: "/products",
    element: <SellerProductManagement/>,
  },
  {
    path: "/dashboard",
    element: <SellerDashboard/>,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
