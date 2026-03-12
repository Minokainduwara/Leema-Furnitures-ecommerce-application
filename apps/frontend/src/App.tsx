import { Route, Routes } from "react-router";
import Home from './pages/Home.tsx'
import Dashboard from "./pages/Dashboard.tsx";
function App() {

  return (
    <div>
        <Routes>
          <Route path="/HomePage" element={<Home/>} />
        </Routes>

        <Routes>
          <Route path="/Dashboard" element={<Dashboard/>} />
        </Routes>

    </div>
  )
}

export default App
