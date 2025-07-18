import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you with your journal today?" }
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await axios.post("http://localhost:8082/api/chat", {
        message: input
      });

      const botMessage = { sender: "bot", text: response.data };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: "bot", text: "Error: Unable to reach server." };
      setMessages(prev => [...prev, errorMessage]);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ width: "400px", margin: "50px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Journal ChatBot</h2>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "10px",
        height: "400px",
        overflowY: "scroll",
        backgroundColor: "#f9f9f9"
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              maxWidth: "70%",
              padding: "8px 12px",
              borderRadius: "16px",
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#DCF8C6" : "#E0E0E0"
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ flexGrow: 1, padding: "10px", fontSize: "14px" }}
        />
        <button
          onClick={sendMessage}
          style={{ padding: "10px 15px", fontSize: "14px", marginLeft: "5px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;