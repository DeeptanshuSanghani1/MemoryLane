import { Settings } from "page-flip";
import "./index.css";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import RootLayout from "./layout/RootLayout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import HomePage from "./pages/HomePage";
import MemoryLane from "./components/memoryLane";
import ProtectedLayout from "./layout/ProtectedLayout";

function App() {
  return (
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
  );
}
export default App;