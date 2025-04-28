import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import jwt_decode from "jwt-decode";

const initialState = {
  messages: [],
  loading: false,
  error: null,
  context: null,
  prescription: null,
  selectedLanguage: "en",
};

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setContext: (state, action) => {
      state.context = action.payload;
    },
    setPrescription: (state, action) => {
      state.prescription = action.payload;
    },
    setLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
    resetChat: (state) => {
      state.messages = [];
      state.context = null;
      state.error = null;
      state.loading = false;
      state.prescription = null;
    },
  },
});

export const { 
  addMessage, 
  setLoading, 
  setError, 
  setContext, 
  setPrescription,
  setLanguage,
  resetChat 
} = chatbotSlice.actions;

export const sendMessage = (message) => async (dispatch, getState) => {
  const { context } = getState().chatbot;
  const { selectedLanguage } = getState().chatbot;
  const { userId } = jwt_decode(localStorage.getItem("token"));
  
  dispatch(addMessage({ sender: "user", text: message }));
  dispatch(setLoading(true));

  try {
    let response;

    if (!context) {
      if (message.toLowerCase().includes("book an appointment")) {
        dispatch(setContext({ context: "booking", doctorName: null, date: null, time: null }));
        dispatch(addMessage({ sender: "bot", text: "Please provide the doctor's name." }));
      } 
      else if (message.toLowerCase().includes("doctor")) {
        dispatch(setContext({ context: "doctor-info", doctorName: null }));
        dispatch(addMessage({ sender: "bot", text: "Please provide the doctor's name." }));
      } 
      else if (message.toLowerCase().includes("symptoms")) {
        dispatch(setContext({ context: "symptom" }));
        dispatch(addMessage({ sender: "bot", text: "Please describe your symptoms." }));
      } 
      else if (message.toLowerCase().includes("prescription")) {
        dispatch(setContext({ context: "prescription" }));
        dispatch(addMessage({ 
          sender: "bot", 
          text: "Please upload or describe your prescription in text.",
          showUpload: true
        }));
      } 
      else {
        dispatch(addMessage({
          sender: "bot", 
          text: "I'm here to assist you! To get started, please select an option using the buttons below."
        }));
      }
    } 
    else {
      if (context.context === "booking") {
        if (!context.doctorName) {
          dispatch(setContext({ ...context, doctorName: message }));
          dispatch(addMessage({ sender: "bot", text: "Got it! What date would you like to book the appointment?" }));
        } 
        else if (!context.date) {
          dispatch(setContext({ ...context, date: message }));
          dispatch(addMessage({ sender: "bot", text: "Great! What time works for you?" }));
        } 
        else if (!context.time) {
          dispatch(setContext({ ...context, time: message }));
          dispatch(addMessage({ sender: "bot", text: "Got it! Let's confirm the details." }));
        } 
        else if (context.time) {
          response = await axios.post("/chat/booking", {
            doctorName: context.doctorName,
            date: context.date,
            time: context.time,
            patientName: userId,  
            language: selectedLanguage
          });
      
          dispatch(addMessage({ sender: "bot", text: response.data.reply || "Your appointment has been booked!" }));
          dispatch(setContext(null));
        }
      } 
      else if (context.context === "doctor-info") {
        response = await axios.post("chat/doctor-info", { 
          doctorName: message,
          language: selectedLanguage
        });
        dispatch(addMessage({ sender: "bot", text: response.data.reply }));
        dispatch(setContext(null));
      } 
      else if (context.context === "symptom") {
        response = await axios.post("/chat/symptom", { 
          symptoms: message,
          language: selectedLanguage
        });
        dispatch(addMessage({
          sender: "bot",
          text: response.data.advice,
          suggestedDoctors: response.data.suggestedDoctors
        }));
        dispatch(setContext(null));
      } 
      else if (context.context === "prescription") {
        response = await axios.post("/chat/prescription", {
          text: message,
          language: selectedLanguage
        });
        dispatch(addMessage({
          sender: "bot",
          text: response.data.explanation
        }));
        dispatch(setContext(null));
      }
    }
  } catch (error) {
    dispatch(setError("Failed to get a response from the chatbot."));
  } finally {
    dispatch(setLoading(false));
  }
};

export const uploadPrescription = (file) => async (dispatch, getState) => {
  const { selectedLanguage } = getState().chatbot;
  const formData = new FormData();
  formData.append("prescription", file);
  formData.append("language", selectedLanguage);

  dispatch(setLoading(true));
  try {
    const response = await axios.post("/chat/ocr-prescription", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    
    dispatch(addMessage({
      sender: "bot",
      text: response.data.explanation
    }));
  } catch (error) {
    dispatch(setError("Failed to process prescription"));
  } finally {
    dispatch(setLoading(false));
  }
};

export default chatbotSlice.reducer;