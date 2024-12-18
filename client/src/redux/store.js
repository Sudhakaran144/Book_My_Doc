import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/rootSlice";
import chatbotReducer from "./reducers/ChatbotSlice.js";

const store = configureStore({
  reducer: {
    root: rootReducer,
    chatbot: chatbotReducer, // Add chatbot slice here
  },
});

export default store;
