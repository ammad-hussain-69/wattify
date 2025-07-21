import React, { useState } from "react";
import styles from "./styles.module.css";
import Logo from "../../assets/images/logoBlack.png";
import { MdOutlineDashboard } from "react-icons/md";
import { CiLogout, CiSettings, CiMenuFries } from "react-icons/ci";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logoutUser = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.removeItem("authUser");
      window.location.reload();
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("❌ Logout error:", error.message);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div
        className={styles.menuIcon}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <CiMenuFries size={28} />
      </div>

      <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
        <img src={Logo} alt="Logo" width={"50%"} />
        <ul>
          <div>
            <li className={isActive("/dashboard") ? styles.activeLink : ""}>
              <Link to="/dashboard" className={styles.navLink}>
                <MdOutlineDashboard /> Dashboard
              </Link>
            </li>
            <li className={isActive("/reports") ? styles.activeLink : ""}>
              <Link to="/reports" className={styles.navLink}>
                <CiSettings /> Reports
              </Link>
            </li>
          </div>
          <div>
            <li onClick={logoutUser}>
              <Link to="#" className={styles.navLink}>
                <CiLogout /> Logout
              </Link>
            </li>
          </div>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
