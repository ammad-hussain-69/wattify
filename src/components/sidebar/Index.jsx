import React from "react";
import styles from "./styles.module.css";
import Logo from "../../assets/images/logoBlack.png";
import { MdOutlineDashboard } from "react-icons/md";
import { CiLogout, CiSettings } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
const Sidebar = () => {
  let navigate = useNavigate()
  const logoutUser = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate("/")
      localStorage.removeItem("authUser")
      location.reload()
    } catch (error) {
      console.error("❌ Logout error:", error.message);
    }
  };

  return (
    <div className={styles.sidebar}>
      <img src={Logo} alt="Logo" />
      <ul>
        <li><Link style={{ textDecoration: "none", color: "inherit" }} to="/dashboard"><MdOutlineDashboard /> Dashboard</Link></li>
        {/* <li><Link style={{ textDecoration: "none", color: "inherit" }} to="/settings"><CiSettings /> Settings</Link></li> */}
        <li><Link style={{ textDecoration: "none", color  : "inherit" }} onClick={logoutUser}><CiLogout /> Logout</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
