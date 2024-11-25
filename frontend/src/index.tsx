import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// import React from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";
// import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import RootLayout from "./layouts/RootLayout.tsx";
// import { AuthProvider } from "./layouts/AuthContext.tsx";
// import ProtectedLayout from "./layouts/ProtectedLayout.tsx";
// import Register from "./pages/Authentication/Register.tsx";
// import Home from "./pages/Home.tsx";
// import Login from "./pages/Authentication/Login.tsx";
// import ChatBotPage from "./pages/ChatBotPage.tsx";
// import ForgotPassword from "./pages/Authentication/ForgotPassword.tsx";
// import { DataLeakAnalytics } from "./pages/DataLeakAnalytics.tsx";
// import AuthLayout from "./layouts/AuthLayout.tsx";
// import PiiIdentifier from "./pages/PiiIdentifier.tsx";
// import AdminConsole from "./pages/AdminConsole.tsx";
// import Settings from "./pages/Settings.tsx";
// import { AdminLayout } from "./layouts/AdminLayout.tsx";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <Router>
//       <AuthProvider>
//         <RootLayout />
//         <Routes>
//           <Route element={<AuthLayout />}>
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//           </Route>
//           {/* <Route element={<ProtectedLayout />}>
//                   <Route path="/" element={<Home/>}/>
//                 </Route> */}
//           {/* <Route element={<ProtectedLayout />}> */}
//           <Route path="/pii_identifier" element={<PiiIdentifier />} />
//           <Route path="/settings" element={<Settings />} />
//           <Route path="/" element={<Home />} />
//           <Route path="/data_leak" element={<DataLeakAnalytics />} />
//           <Route path="/chat" element={<ChatBotPage />} />
//           {/* <Route element={<AdminLayout/>}> */}
//           <Route path="/admin_console" element={<AdminConsole />} />
//           {/* </Route> */}
//           {/* </Route> */}
//         </Routes>
//       </AuthProvider>
//     </Router>
//   </React.StrictMode>
// );