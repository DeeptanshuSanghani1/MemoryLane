import { Settings } from "page-flip";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import RootLayout from "./layout/RootLayout";
import MemoryLane from "./components/memoryLane";
import ProtectedLayout from "./layout/ProtectedLayout";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import HomePage from "./Pages/HomePage";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to={"/login"} />} />
      <Route element={<RootLayout />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/memoryLane" element={<MemoryLane />} />
        </Route>

      </Route>
    </Routes>
    </BrowserRouter>
  );
}
export default App;