import React from "react";
import styles from "./styles.module.css";
import Logo from "../../assets/images/logoBlack.png";
import { MdOutlineDashboard } from "react-icons/md";
import { CiLogout, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <img src={Logo} alt="Logo" />
      <ul>
        <li><Link style={{ textDecoration: "none", color: "inherit" }} to="/dashboard"><MdOutlineDashboard /> Dashboard</Link></li>
        <li><Link style={{ textDecoration: "none", color: "inherit" }} to="/settings"><CiSettings /> Settings</Link></li>
        <li><Link style={{ textDecoration: "none", color: "inherit" }} to="/logout"><CiLogout /> Logout</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
