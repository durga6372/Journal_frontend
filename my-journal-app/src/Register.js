import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [user, setUser] = useState({
    userName: "",
    password: "",
    email: "",
    sentimentAnalysis: false
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleRegister = async () => {
    setError("");
    if (!user.userName || !user.password) {
      setError("Username and password are required.");
      return;
    }

    try {
      await axios.post("http://localhost:8082/public/register", user);
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      <input
        name="userName"
        placeholder="Username"
        onChange={handleChange}
        value={user.userName}
        style={styles.input}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        value={user.password}
        style={styles.input}
      />
      <input
        name="email"
        placeholder="Email (optional)"
        onChange={handleChange}
        value={user.email}
        style={styles.input}
      />
      <label style={{ fontSize: "14px", marginBottom: "10px", display: "block" }}>
        <input
          type="checkbox"
          name="sentimentAnalysis"
          checked={user.sentimentAnalysis}
          onChange={handleChange}
          style={{ marginRight: "5px" }}
        />
        Enable Sentiment Analysis
      </label>

      <button onClick={handleRegister} style={styles.button}>Register</button>
      <button onClick={() => navigate("/login")} style={styles.linkButton}>
        Already have an account? Login
      </button>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    width: "300px",
    margin: "80px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    fontSize: "14px"
  },
  button: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "10px"
  },
  linkButton: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },
  error: {
    color: "red",
    marginTop: "10px"
  }
};

export default Register;
