import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/Index";
import Dashboard from "./pages/dashboard/Index";
import Protected from "./components/ProtectedRoute";
import Sidebar from "./components/sidebar/Index";
import { useEffect, useState } from "react";
function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    var userToken = localStorage.getItem("authUser");
    setUser(userToken ? JSON.parse(userToken) : null);
  }, []);

  return (
    <>
      {user && <Sidebar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
      </Routes>
    </>
  );
}

export default App;
