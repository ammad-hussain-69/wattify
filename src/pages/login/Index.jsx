import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { auth } from "../../config/firebase";
import { db } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ToastContainer, Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logoWhite.png";
const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    wifiKey: "",
    contactNumber: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("authUser");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const {
      email,
      password,
      firstName,
      lastName,
      username,
      wifiKey,
      contactNumber,
    } = formData;

    // Common validation
    if (!email || !password) {
      toast.error("Email and password are required", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
      return false;
    }

    // Password validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
      return false;
    }

    // Sign-up specific validation
    if (!isLogin) {
      if (!firstName || !lastName || !username || !wifiKey || !contactNumber) {
        toast.error("All fields are required for sign up", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          transition: Bounce,
        });
        return false;
      }

      // Contact number validation
      const phoneRegex = /^\+?[\d\s-()]{10,}$/;
      if (!phoneRegex.test(contactNumber)) {
        toast.error("Please enter a valid contact number", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          transition: Bounce,
        });
        return false;
      }
    }

    return true;
  };

  const getFirebaseErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email address";
      case "auth/wrong-password":
        return "Incorrect password. Please try again";
      case "auth/invalid-email":
        return "Invalid email address format";
      case "auth/user-disabled":
        return "This account has been disabled";
      case "auth/email-already-in-use":
        return "An account with this email already exists";
      case "auth/weak-password":
        return "Password is too weak. Please choose a stronger password";
      case "auth/network-request-failed":
        return "Network error. Please check your connection and try again";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later";
      case "auth/invalid-credential":
        return "Invalid login credentials. Please check your email and password";
      default:
        return "An unexpected error occurred. Please try again";
    }
  };

  const handleSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { email, password } = formData;

      if (isLogin) {
        // Handle login
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        localStorage.setItem("authUser", JSON.stringify(user));
        location.reload()
        toast.success(`Welcome back, ${userCredential.user.email}!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          transition: Bounce,
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000); // Redirect to dashboard after 1 second
        // Clear form after successful login
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          username: "",
          password: "",
          wifiKey: "",
          contactNumber: "",
        });
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          wifiKey: formData.wifiKey,
          contactNumber: formData.contactNumber,
          createdAt: new Date().toISOString(),
        });

        toast.success(`Account created successfully! Welcome, ${user.email}!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          transition: Bounce,
        });

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          username: "",
          password: "",
          wifiKey: "",
          contactNumber: "",
        });

        setIsLogin(true);
      }
    } catch (error) {
      console.error("Authentication error:", error);

      const errorMessage = getFirebaseErrorMessage(error.code);

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = (mode) => {
    setIsLogin(mode === "login");
    // Clear form when switching modes
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      wifiKey: "",
      contactNumber: "",
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <div className={styles.formContainer}>
            {/* Toggle Buttons */}
            <div className={styles.toggleContainer}>
              <button
                className={`${styles.toggleButton} ${
                  isLogin ? styles.active : ""
                }`}
                onClick={() => toggleMode("login")}
                disabled={isLoading}
              >
                Login
              </button>
              <button
                className={`${styles.toggleButton} ${
                  !isLogin ? styles.active : ""
                }`}
                onClick={() => toggleMode("signup")}
                disabled={isLoading}
              >
                Sign Up
              </button>
            </div>

            {/* Form Fields */}
            <div className={styles.form}>
              {/* Sign Up Only Fields */}
              <div
                className={isLogin ? styles.hiddenFields : styles.visibleFields}
              >
                <div className={styles.inputGroup}>
                  <label className={styles.label}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className={styles.input}
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    placeholder="Enter your first name"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className={styles.input}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              {/* Common Fields */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  className={styles.input}
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  placeholder="Enter your email address"
                />
              </div>

              {/* Sign Up Only Fields */}
              <div
                className={isLogin ? styles.hiddenFields : styles.visibleFields}
              >
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Username</label>
                  <input
                    type="text"
                    name="username"
                    className={styles.input}
                    value={formData.username}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    placeholder="Choose a username"
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  className={styles.input}
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  placeholder="Enter your password"
                />
              </div>

              {/* Sign Up Only Fields */}
              <div
                className={isLogin ? styles.hiddenFields : styles.visibleFields}
              >
                <div className={styles.inputGroup}>
                  <label className={styles.label}>WiFi Key</label>
                  <input
                    type="text"
                    name="wifiKey"
                    className={styles.input}
                    value={formData.wifiKey}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    placeholder="Enter your WiFi key"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Contact Number</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    className={styles.input}
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    placeholder="Enter your contact number"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                className={`${styles.submitButton} ${
                  isLoading ? styles.loading : ""
                }`}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    {isLogin ? "Logging in..." : "Signing up..."}
                  </>
                ) : isLogin ? (
                  "Login"
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className={styles.rightPanel}>
          <div className={styles.rightContent}>
            <div className={styles.logo}>
              <img src={Logo} alt="" width={"50%"} draggable={false} />
            </div>

            <h1 className={styles.heroTitle}>
              Monitor your energy usage in real-time
            </h1>

            <p className={styles.heroSubtitle}>
              Track, analyze, and optimize your household's energy consumption
              with our intuitive dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </>
  );
};

export default Index;
