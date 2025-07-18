import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatBot from "./Components/ChatBot";
import JournalManager from "./Components/JournalManager";

function App() {
  const [view, setView] = useState("chat");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated) return null;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>My Journal Assistant</h1>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={() => setView("chat")} style={view === "chat" ? activeBtn : inactiveBtn}>
          ChatBot
        </button>
        <button onClick={() => setView("journals")} style={view === "journals" ? activeBtn : inactiveBtn}>
          Journal Manager
        </button>
      </div>
      {view === "chat" && <ChatBot />}
      {view === "journals" && <JournalManager />}
    </div>
  );
}

const activeBtn = {
  padding: "10px 20px",
  margin: "0 5px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "5px"
};

const inactiveBtn = {
  padding: "10px 20px",
  margin: "0 5px",
  backgroundColor: "#e0e0e0",
  color: "black",
  border: "none",
  borderRadius: "5px"
};

export default App;
