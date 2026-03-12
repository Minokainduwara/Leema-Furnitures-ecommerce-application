import { Route, Routes } from "react-router";
import Home from './pages/Home.tsx'
import Dashboard from "./pages/Dashboard.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/SignUp.tsx";

function App() {

  return (
    <div>
        <Routes>
          <Route path="/HomePage" element={<Home/>} />
        </Routes>

        <Routes>
          <Route path="/Dashboard" element={<Dashboard/>} />
        </Routes>

        <Routes>
          <Route path="/Login" element={<Login/>} />
        </Routes>

        <Routes>
          <Route path="/Signup" element={<Signup/>} />
        </Routes>

    </div>
  )
}

export default App
