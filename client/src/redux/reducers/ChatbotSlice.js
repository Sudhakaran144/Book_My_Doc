import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import jwt_decode from "jwt-decode"

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState: {
    messages: [],
    loading: false,
    error: null,
    context: null, // To keep track of the conversation context (booking, doctorInfo, symptomChecker)
  },
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
    resetChat: (state) => {
      state.messages = [];
      state.context = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const { addMessage, setLoading, setError, setContext,resetChat } = chatbotSlice.actions;

// Send message action (async)
export const sendMessage = (message) => async (dispatch, getState) => {
  const { context } = getState().chatbot;
  const { userId } = jwt_decode(localStorage.getItem("token"));
  console.log(context,userId); // Check the context state
  
  dispatch(addMessage({ sender: "user", text: message }));
  dispatch(setLoading(true));

  try {
    let response;

    if (!context) {
       
      // Set the context based on the message
      if (message.toLowerCase().includes("book an appointment")) {
        dispatch(setContext({ context: "booking", doctorName: null, date: null, time: null }));
        dispatch(addMessage({ sender: "bot", text: "Please provide the doctor's name." }));
      } else if (message.toLowerCase().includes("doctor")) {
        dispatch(setContext({ context: "doctor-info", doctorName: null, date: null, time: null }));
        dispatch(addMessage({ sender: "bot", text: "Please provide the doctor's name." }));
      } else if (message.toLowerCase().includes("symptoms")) {
        dispatch(setContext({ context: "symptom", doctorName: null, date: null, time: null }));
        dispatch(addMessage({ sender: "bot", text: "Please describe your symptoms." }));
      }
      else {
        dispatch(addMessage({
          sender : "bot", text : "I'm here to assist you! To get started, please select an option using the buttons below."
        }))
      }
    } else {
      if (context.context === "booking") {
        if (!context.doctorName) {
          dispatch(setContext({ ...context, doctorName: message }));
          dispatch(addMessage({ sender: "bot", text: "Got it! What date would you like to book the appointment?" }));
        } else if (!context.date) {
          dispatch(setContext({ ...context, date: message }));
          dispatch(addMessage({ sender: "bot", text: "Great! What time works for you?" }));
        } else if (!context.time) {
          dispatch(setContext({ ...context, time: message }));
          dispatch(addMessage({ sender: "bot", text: "Got it! Let's confirm the details." }));
        } else if (context.time) {
          response = await axios.post("/chat/booking", {
            doctorName: context.doctorName,
            date: context.date,
            time: context.time,
            patientName: userId,  
          });
      
          dispatch(addMessage({ sender: "bot", text: response.data.reply || "Your appointment has been booked!" }));
          dispatch(setContext(null)); // Reset context
        } else {
          dispatch(addMessage({ sender: "bot", text: "Please provide the appointment time." }));
        }
     } else if (context.context === "doctor-info") {
        response = await axios.post("/chat/doctor-info", { doctorName: message });
        dispatch(addMessage({ sender: "bot", text: response.data.reply || "I couldn't find any information." }));
        dispatch(setContext(null));
      } else if (context.context === "symptom") {
        response = await axios.post("/chat/symptom", { symptoms: message });
        dispatch(
          addMessage({
            sender: "bot",
            text: response.data.advice || "I couldn't provide advice.",
            suggestedDoctors: response.data.suggestedDoctors || [],
          })
        );
        dispatch(setContext(null));
      }
    }
  } catch (error) {
    dispatch(setError("Failed to get a response from the chatbot."));
  } finally {
    dispatch(setLoading(false));
  }
};


export default chatbotSlice.reducer;
