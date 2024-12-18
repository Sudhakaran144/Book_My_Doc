const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Appointment = require("../models/appointmentModel"); // Placeholder for Appointment schema
const Doctor = require("../models/doctorModel"); // Placeholder for Doctor schema
const user =  require('../models/userModel')
const Notification = require("../models/notificationModel")
require("dotenv").config();

const router = express.Router();
 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure the model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Route for Doctor Info
router.post("/doctor-info", async (req, res) => {
  const { doctorName } = req.body;

  if (!doctorName) {
    return res.status(400).json({ error: "Please provide a doctor name." });
  }

  try {
    const userDoc = await user.findOne({ firstname: doctorName }); 

    console.log(userDoc)

    if (!userDoc) {
      return res.status(404).json({ error: `No user found with name ${doctorName}.` });
    }
  
    const doctorInfo = await Doctor.findOne({ userId: userDoc._id });

    console.log(doctorInfo) 

    if (doctorInfo) {
      const responseMessage = `
        Dr. ${userDoc.firstname} specializes in ${doctorInfo.specialization}. 
        Consultation fees: $${doctorInfo.fees}. 
        Experience: ${doctorInfo.experience} years.
      `;
      res.json({ reply: responseMessage });
    } else {
      res.json({ reply: `I'm sorry, I couldn't find any information about Dr. ${doctorName}.` });
    }
  } catch (error) {
    console.error("Error fetching doctor info:", error);
    res.status(500).json({ error: "Error fetching doctor information" });
  }
});

 
// Route for Booking Appointment
router.post("/booking", async (req, res) => {
  const { doctorName, date, time, patientName } = req.body;

  if (!doctorName || !date || !time || !patientName) {
    return res.status(400).json({ error: "Please provide doctor name, date, and time." });
  }

  try {
    // Fetch user info based on doctor's name (find doctor)
    const userDoc = await user.findOne({ firstname: doctorName });

    if (!userDoc) {
      return res.json({ reply: `Dr. ${doctorName} is not available in our system.` });
    }

    // Find the associated doctor info
    const doctorInfo = await Doctor.findOne({ userId: userDoc._id });

    if (!doctorInfo) {
      return res.json({ reply: `No information found for Dr. ${doctorName}.` });
    }

    // Save the appointment, just like in the appointmentController
    const appointment = new Appointment({
      date: date,
      time: time,
      doctorId: userDoc._id,   
      userId: patientName, 
      status: "Pending",           
    });

    // Create notifications for both user and doctor
    const userNotification = new Notification({
      userId: patientName,
      content: `You have successfully booked an appointment with Dr. ${userDoc.firstname } ${userDoc.lastname} for ${date} at ${time}.`,
    });
    await userNotification.save();

    const doctorNotification = new Notification({
      userId: userDoc._id,
      content: `You have an appointment with ${patientName} on ${date} at ${time}.`,
    });
    await doctorNotification.save();

    // Save the appointment to the database
    await appointment.save();

    // Respond with a success message
    const responseMessage = `Your appointment with Dr. ${doctorName} on ${date} at ${time} has been successfully booked!`;
    res.json({ reply: responseMessage,appointmentDetails: appointment, });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ error: "Error booking appointment" });
  }
});



 

// Use the correct method to generate text
 
router.post("/symptom", async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms || symptoms.trim().length === 0) {
    return res.status(400).json({ error: "Please provide symptoms to analyze." });
  }

  try {
    // Symptom-to-Specialization Mapping
    
    const symptomToSpecialization = {
  // General Symptoms
  headache: "Neurologist",
  fever: "General Practitioner",
  fatigue: "Endocrinologist",
  dizziness: "Neurologist",
  weakness: "General Practitioner",
  weightLoss: "Endocrinologist",

  // Respiratory Symptoms
  cough: "Pulmonologist",
  flu: "General Practitioner",
  cold: "General Practitioner",
  "shortness of breath": "Pulmonologist",
  wheezing: "Pulmonologist",
  asthma: "Pulmonologist",
  "chest congestion": "Pulmonologist",

  // Cardiac Symptoms
  "chest pain": "Cardiologist",
  "irregular heartbeat": "Cardiologist",
  hypertension: "Cardiologist",
  "shortness of breath with exertion": "Cardiologist",

  // Gastrointestinal Symptoms
  "stomach ache": "Gastroenterologist",
  "acid reflux": "Gastroenterologist",
  diarrhea: "Gastroenterologist",
  constipation: "Gastroenterologist",
  nausea: "Gastroenterologist",
  vomiting: "Gastroenterologist",
  "blood in stool": "Gastroenterologist",
  bloating: "Gastroenterologist",
  jaundice: "Hepatologist",

  // ENT Symptoms
  "sore throat": "ENT Specialist",
  "ear pain": "ENT Specialist",
  "hearing loss": "ENT Specialist",
  tinnitus: "ENT Specialist",
  "nasal congestion": "ENT Specialist",
  "loss of smell": "ENT Specialist",
  sinusitis: "ENT Specialist",

  // Neurological Symptoms
  migraine: "Neurologist",
  "blurred vision": "Neurologist",
  "tingling sensation": "Neurologist",
  "numbness in limbs": "Neurologist",
  seizures: "Neurologist",
  "memory loss": "Neurologist",

  // Skin Symptoms
  rash: "Dermatologist",
  itching: "Dermatologist",
  acne: "Dermatologist",
  eczema: "Dermatologist",
  psoriasis: "Dermatologist",
  "skin discoloration": "Dermatologist",
  "hair loss": "Dermatologist",

  // Musculoskeletal Symptoms
  "joint pain": "Orthopedist",
  "back pain": "Orthopedist",
  "muscle cramps": "Orthopedist",
  "bone fracture": "Orthopedist",
  "stiffness in joints": "Rheumatologist",
  arthritis: "Rheumatologist",

  // Endocrine Symptoms
  "excessive thirst": "Endocrinologist",
  "frequent urination": "Endocrinologist",
  "unexplained weight gain": "Endocrinologist",
  "hair thinning": "Endocrinologist",

  // Psychological Symptoms
  anxiety: "Psychiatrist",
  depression: "Psychiatrist",
  insomnia: "Psychiatrist",
  "mood swings": "Psychiatrist",
  "behavioral changes": "Psychiatrist",

  // Pediatric Symptoms
  "delayed growth": "Pediatrician",
  "frequent infections": "Pediatrician",
  colic: "Pediatrician",
  "bedwetting": "Pediatrician",

  // Gynecological Symptoms
  "menstrual irregularities": "Gynecologist",
  "pelvic pain": "Gynecologist",
  "abnormal vaginal discharge": "Gynecologist",
  "breast lump": "Gynecologist",

  // Urological Symptoms
  "painful urination": "Urologist",
  "blood in urine": "Urologist",
  "urinary incontinence": "Urologist",
  "kidney stones": "Urologist",
  "prostate issues": "Urologist",

  // Ophthalmological Symptoms
  "blurred vision": "Ophthalmologist",
  "red eyes": "Ophthalmologist",
  "eye pain": "Ophthalmologist",
  cataracts: "Ophthalmologist",
  "vision loss": "Ophthalmologist",
};


    // Prepare the prompt for AI
    const prompt = `
      You are a healthcare assistant. Based on the symptoms provided, suggest the likely condition in 2-3 sentences. 
      Symptoms: ${symptoms}
    `;

    // Generate content using the AI model
    const result = await model.generateContent([prompt]);

    if (result && result.response && result.response.candidates) {
      // Access the first candidate's content text
      const candidate = result.response.candidates[0];
      const advice = candidate.content?.parts[0]?.text?.trim(); // Adjusted path

      if (!advice) {
        return res.status(500).json({ error: "No valid advice generated by the AI model." });
      }

      // Extract relevant specializations based on symptoms
      const extractedSpecializations = Object.keys(symptomToSpecialization)
        .filter((symptom) => symptoms.toLowerCase().includes(symptom))
        .map((symptom) => symptomToSpecialization[symptom]);

      console.log("Extracted Specializations:", extractedSpecializations);

      let doctorSuggestions = "No matching doctors found in our database.";

      if (extractedSpecializations.length > 0) {
        // Query matching doctors from the database
        const matchingDoctors = await Doctor.find({
          specialization: { $in: extractedSpecializations },
        });

        console.log("Matching Doctors:", matchingDoctors);

        if (matchingDoctors.length > 0) {
          // Map over the matching doctors and fetch user info
          const doctorSuggestionsList = await Promise.all(
            matchingDoctors.map(async (doctor) => {
              const userInfo = await user.findOne({ _id: doctor.userId });

              // Ensure we return the formatted doctor string
              return `Dr. ${userInfo.firstname} ${userInfo.lastname} (${doctor.specialization})`;
            })
          );

          // Join all doctor suggestions into a string
          doctorSuggestions = doctorSuggestionsList.join(", ");
        }
      }

      // Respond with advice and suggested doctors
      res.json({
        advice: advice,
        suggestedDoctors: doctorSuggestions,
      });
    } else {
      res.status(500).json({ error: "No valid response from AI." });
    }
  } catch (error) {
    console.error("Error with symptom checker:", error);
    res.status(500).json({ error: "Error analyzing symptoms" });
  }
});








module.exports = router;
