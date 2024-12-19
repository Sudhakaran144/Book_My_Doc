import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, resetChat } from "../redux/reducers/ChatbotSlice.js";
import "../styles/chatbot.css"; 

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false); // To toggle chatbot visibility
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.chatbot);

  const handleSend = () => {
    if (input.trim()) {
      dispatch(sendMessage(input));
      setInput("");
    }
  };

  const handleQuickAction = (message) => {
    dispatch(sendMessage(message));
  };

  const handleToggleChatbot = () => {
    if (isOpen) {
      // Reset chat when closing the chatbot
      dispatch(resetChat());
    }
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Chatbot Floating Button */}
      <div className="chatbot-floating-btn" onClick={handleToggleChatbot}>
        💬
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h4>Chatbot</h4>
            <button onClick={handleToggleChatbot}>×</button>
          </div>
          <div className="chat-window">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <p>{msg.text}</p>
                {msg.suggestedDoctors && (
                  <>
                    {Array.isArray(msg.suggestedDoctors) ? (
                      <ul className="doctor-list">
                        {msg.suggestedDoctors.map((doc, i) => (
                          <li key={i}>
                            <strong>{doc.name}</strong> ({doc.specialization})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>{msg.suggestedDoctors}</p>
                    )}
                  </>
                )}
              </div>
            ))}
            {loading && <div className="message bot">Typing...</div>}
          </div>

          {error && <div className="error">{error}</div>}

          {/* Quick Action Buttons */}
          <div className="quick-actions">
            <button
              className="quick-action-btn"
              onClick={() =>
                handleQuickAction("I want to book an appointment.")
              }
              disabled={loading}
            >
              Booking
            </button>
            <button
              className="quick-action-btn"
              onClick={() => handleQuickAction("Tell me about doctors.")}
              disabled={loading}
            >
              Doctor Info
            </button>
            <button
              className="quick-action-btn"
              onClick={() =>
                handleQuickAction("I have symptoms and need advice.")
              }
              disabled={loading}
            >
              Symptom Checker
            </button>
          </div>

          {/* Input Area */}
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
