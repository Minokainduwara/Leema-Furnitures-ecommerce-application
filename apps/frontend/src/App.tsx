import React, { useEffect } from "react";
import { AuthProvider } from "./hooks/Authcontext";
import AppRoutes from "./router/index";
import CategoryPage from "./pages/Category-pages/Category";


const App: React.FC = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap";
    link.rel  = "stylesheet";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <AuthProvider>
      {/* <AppRoutes /> */}
      <CategoryPage/>
    </AuthProvider>

  );
};

export default App;
