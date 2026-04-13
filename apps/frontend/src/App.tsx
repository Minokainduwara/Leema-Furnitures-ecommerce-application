import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignUp";
import AdminDashboard from "./pages/admin-pages/AdminLayout";

import MyDetails from "./components/Admin-Components/MyDetails";

function App() {
  return (
    <Routes>
      <Route path="/homepage" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Dashboard Layout */}
      <Route path="/admindashboard" element={<AdminDashboard />}>
        <Route index element={<MyDetails />} />
      </Route>
    </Routes>
  );
}

export default App;