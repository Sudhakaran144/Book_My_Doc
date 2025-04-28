import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector, } from "react-redux"; 
 import { sendMessage, resetChat, setLanguage, uploadPrescription } from "../redux/reducers/ChatbotSlice.js";
import "../styles/chatbot.css";


const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const dispatch = useDispatch();
  const { messages, loading, error, selectedLanguage } = useSelector((state) => state.chatbot);
  const messagesEndRef = useRef(null);

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "hi", name: "हिंदी" },
  ];

  const translations = {
    en: {
      welcomeTitle: "Hello there!",
      welcomeMessage: "How can I help you with your health concerns today?",
      placeholderText: "Type your message here...",
      bookAppointment: "Book Appointment",
      findDoctors: "Find Doctors",
      symptomCheck: "Symptom Check",
      healthTips: "Health Tips",
      labTests: "Lab Tests",
      prescriptionExplain: "Explain Prescription",
      uploadPrescription: "Upload Prescription",
      describePrescription: "Or describe it in text",
      language: "Language",
      poweredBy: "Powered by Healthcare AI • ",
      terms: "Terms"
    },
    es: {
      welcomeTitle: "¡Hola!",
      welcomeMessage: "¿Cómo puedo ayudarte con tus problemas de salud hoy?",
      placeholderText: "Escribe tu mensaje aquí...",
      bookAppointment: "Reservar Cita",
      findDoctors: "Buscar Médicos",
      symptomCheck: "Revisar Síntomas",
      healthTips: "Consejos de Salud",
      labTests: "Pruebas de Lab",
      prescriptionExplain: "Explicar Receta",
      uploadPrescription: "Subir Receta",
      describePrescription: "O descríbela en texto",
      language: "Idioma",
      poweredBy: "Desarrollado por Healthcare AI • ",
      terms: "Términos"
    },
    fr: {
      welcomeTitle: "Bonjour!",
      welcomeMessage: "Comment puis-je vous aider avec vos problèmes de santé aujourd'hui?",
      placeholderText: "Écrivez votre message ici...",
      bookAppointment: "Prendre RDV",
      findDoctors: "Trouver Médecins",
      symptomCheck: "Vérifier Symptômes",
      healthTips: "Conseils Santé",
      labTests: "Tests Médicaux",
      prescriptionExplain: "Expliquer Ordonnance",
      uploadPrescription: "Télécharger Ordonnance",
      describePrescription: "Ou décrivez-la en texte",
      language: "Langue",
      poweredBy: "Propulsé par Healthcare AI • ",
      terms: "Conditions"
    },
    de: {
      welcomeTitle: "Hallo!",
      welcomeMessage: "Wie kann ich Ihnen heute bei Ihren Gesundheitsproblemen helfen?",
      placeholderText: "Schreiben Sie Ihre Nachricht hier...",
      bookAppointment: "Termin Buchen",
      findDoctors: "Ärzte Finden",
      symptomCheck: "Symptome Prüfen",
      healthTips: "Gesundheitstipps",
      labTests: "Labortests",
      prescriptionExplain: "Rezept Erklären",
      uploadPrescription: "Rezept Hochladen",
      describePrescription: "Oder beschreiben Sie es im Text",
      language: "Sprache",
      poweredBy: "Unterstützt von Healthcare AI • ",
      terms: "Bedingungen"
    },
    hi: {
      welcomeTitle: "नमस्ते!",
      welcomeMessage: "आज मैं आपकी स्वास्थ्य संबंधी चिंताओं में कैसे मदद कर सकता हूं?",
      placeholderText: "अपना संदेश यहां लिखें...",
      bookAppointment: "अपॉइंटमेंट बुक करें",
      findDoctors: "डॉक्टर खोजें",
      symptomCheck: "लक्षण जांच",
      healthTips: "स्वास्थ्य टिप्स",
      labTests: "लैब टेस्ट",
      prescriptionExplain: "प्रिस्क्रिप्शन समझाएं",
      uploadPrescription: "प्रिस्क्रिप्शन अपलोड करें",
      describePrescription: "या इसे टेक्स्ट में वर्णित करें",
      language: "भाषा",
      poweredBy: "Healthcare AI द्वारा संचालित • ",
      terms: "नियम"
    }
  };

  const t = translations[selectedLanguage] || translations.en;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      dispatch(sendMessage(input));
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (message) => {
    dispatch(sendMessage(message));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(uploadPrescription(file));
    }
  };

  const handleLanguageChange = (languageCode) => {
    dispatch(setLanguage(languageCode));
    setShowLanguageMenu(false);
  };

  return (
    <div className="chatbot-wrapper">
      <button 
        className={`chatbot-floating-btn ${isOpen ? "active" : ""}`}
        onClick={() => {
          if (isOpen) dispatch(resetChat());
          setIsOpen(!isOpen);
        }}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? "×" : "💬"}
      </button>

      <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
        <div className="chatbot-header">
          <div className="header-content">
            <div className="chatbot-avatar">AI</div>
            <h4>Healthcare Assistant</h4>
            <span className="status-indicator online"></span>
          </div>
          <div className="header-actions">
            <button 
              className="language-btn" 
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              aria-label="Change language"
            >
              <span className="language-icon">🌐</span>
            </button>
            <button 
              className="close-btn" 
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>
        </div>

        {showLanguageMenu && (
          <div className="language-menu">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`language-option ${selectedLanguage === lang.code ? "active" : ""}`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                {lang.name}
              </button>
            ))}
          </div>
        )}

        <div className="chat-window">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <div className="welcome-icon">👋</div>
              <h3>{t.welcomeTitle}</h3>
              <p>{t.welcomeMessage}</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message-container ${msg.sender === "user" ? "user-container" : "bot-container"}`}
              >
                {msg.sender === "bot" && <div className="bot-avatar">AI</div>}
                <div className={`message ${msg.sender}`}>
                  <p>{msg.text}</p>
                  {msg.showUpload && (
                    <div className="prescription-options ">
                      <label className="upload-btn">
                        📁 {t.uploadPrescription}
                        <input 
                          type="file" 
                          hidden 
                          onChange={handleFileUpload}
                          accept="image/*,application/pdf"
                          aria-label="Upload prescription"
                        />
                      </label>
                       
                    </div>
                  )}
                  {msg.suggestedDoctors && (
                    <div className="suggested-doctors">
                      <h4>Recommended Specialists:</h4>
                      {Array.isArray(msg.suggestedDoctors) ? (
                        <ul className="doctor-list">
                          {msg.suggestedDoctors.map((doc, i) => (
                            <li key={i}>
                              <strong>{doc.name}</strong>
                              <span className="specialization">{doc.specialization}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>{msg.suggestedDoctors}</p>
                      )}
                    </div>
                  )}
                </div>
                {msg.sender === "user" && <div className="user-avatar">You</div>}
              </div>
            ))
          )}
          {loading && (
            <div className="message-container bot-container">
              <div className="bot-avatar">AI</div>
              <div className="message bot typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="quick-actions">
          <button
            className="quick-action-btn"
            onClick={() => handleQuickAction("I want to book an appointment.")}
            disabled={loading}
            aria-label="Book appointment"
          >
            <span className="icon">📅</span>
            <span>{t.bookAppointment}</span>
          </button>
          <button
            className="quick-action-btn"
            onClick={() => handleQuickAction("Tell me about doctors.")}
            disabled={loading}
            aria-label="Find doctors"
          >
            <span className="icon">👨‍⚕️</span>
            <span>{t.findDoctors}</span>
          </button>
          <button
            className="quick-action-btn"
            onClick={() => handleQuickAction("I have symptoms and need advice.")}
            disabled={loading}
            aria-label="Symptom check"
          >
            <span className="icon">🩺</span>
            <span>{t.symptomCheck}</span>
          </button>
          <button
            className="quick-action-btn"
            onClick={() => handleQuickAction("I need help with a prescription.")}
            disabled={loading}
            aria-label="Explain prescription"
          >
            <span className="icon">💊</span>
            <span>{t.prescriptionExplain}</span>
          </button>
        </div>

        <div className="input-area">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t.placeholderText}
            disabled={loading}
            rows={1}
            aria-label="Chat input"
          />
          <button 
            className={`send-btn ${input.trim() ? "active" : ""}`} 
            onClick={handleSend} 
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </button>
        </div>
        <div className="chatbot-footer">
          <p>{t.poweredBy}<button className="text-btn">{t.terms}</button></p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;