import { Navigate } from "react-router-dom";

/** Redirects /user/orders to the dashboard orders tab */
export default function UserOrdersPage() {
  return <Navigate to="/user/dashboard?tab=orders" replace />;
}
