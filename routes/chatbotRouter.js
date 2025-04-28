const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Doctor Information
router.post("/doctor-info", async (req, res) => {
  const { doctorName, language } = req.body;

  try {
    const userDoc = await User.findOne({ 
      $or: [
        { firstname: { $regex: new RegExp(doctorName, "i") } },
        { lastname: { $regex: new RegExp(doctorName, "i") } }
      ],
      role: "doctor"
    });

    if (!userDoc) {
      return res.json({ 
        reply: language === "hi" ? 
          `डॉक्टर ${doctorName} हमारे सिस्टम में उपलब्ध नहीं हैं।` :
          `Dr. ${doctorName} is not available in our system.`
      });
    }

    const doctorInfo = await Doctor.findOne({ userId: userDoc._id });

    if (doctorInfo) {
      let responseMessage;
      if (language === "hi") {
        responseMessage = `
          डॉ. ${userDoc.firstname} ${userDoc.lastname} ${doctorInfo.specialization} में विशेषज्ञ हैं।
          परामर्श शुल्क: ₹${doctorInfo.fees}।
          अनुभव: ${doctorInfo.experience} वर्ष।
          ${doctorInfo.bio ? `विवरण: ${doctorInfo.bio}` : ''}
        `;
      } else {
        responseMessage = `
          Dr. ${userDoc.firstname} ${userDoc.lastname} specializes in ${doctorInfo.specialization}.
          Consultation fees: $${doctorInfo.fees}.
          Experience: ${doctorInfo.experience} years.
          ${doctorInfo.bio ? `About: ${doctorInfo.bio}` : ''}
        `;
      }
      res.json({ reply: responseMessage });
    } else {
      res.json({ 
        reply: language === "hi" ?
          `डॉ. ${doctorName} के बारे में जानकारी उपलब्ध नहीं है।` :
          `No information found for Dr. ${doctorName}.`
      });
    }
  } catch (error) {
    console.error("Error fetching doctor info:", error);
    res.status(500).json({ 
      error: "Error fetching doctor information",
      reply: "Sorry, I encountered an error while fetching doctor information."
    });
  }
});

// Book Appointment
router.post("/booking", async (req, res) => {
  const { doctorName, date, time, patientName, language } = req.body;

  try {
    const userDoc = await User.findOne({ 
      $or: [
        { firstname: { $regex: new RegExp(doctorName, "i") } },
        { lastname: { $regex: new RegExp(doctorName, "i") } }
      ],
      role: "doctor"
    });

    if (!userDoc) {
      return res.json({ 
        reply: language === "hi" ?
          `डॉक्टर ${doctorName} हमारे सिस्टम में उपलब्ध नहीं हैं।` :
          `Dr. ${doctorName} is not available in our system.`
      });
    }

    const appointment = new Appointment({
      date,
      time,
      doctorId: userDoc._id,
      userId: patientName,
      status: "Pending",
    });

    // Create notifications
    const patientNotification = new Notification({
      userId: patientName,
      content: language === "hi" ?
        `आपने डॉ. ${userDoc.firstname} ${userDoc.lastname} के साथ ${date} को ${time} बजे अपॉइंटमेंट बुक कर लिया है।` :
        `You have booked an appointment with Dr. ${userDoc.firstname} ${userDoc.lastname} on ${date} at ${time}.`
    });

    const doctorNotification = new Notification({
      userId: userDoc._id,
      content: language === "hi" ?
        `${patientName} ने ${date} को ${time} बजे आपके साथ अपॉइंटमेंट बुक किया है।` :
        `You have an appointment with ${patientName} on ${date} at ${time}.`
    });

    await Promise.all([
      appointment.save(),
      patientNotification.save(),
      doctorNotification.save()
    ]);

    const responseMessage = language === "hi" ?
      `डॉ. ${userDoc.firstname} ${userDoc.lastname} के साथ ${date} को ${time} बजे आपकी अपॉइंटमेंट सफलतापूर्वक बुक हो गई है!` :
      `Your appointment with Dr. ${userDoc.firstname} ${userDoc.lastname} on ${date} at ${time} has been successfully booked!`;

    res.json({ reply: responseMessage });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ 
      error: "Error booking appointment",
      reply: "Sorry, I encountered an error while booking your appointment."
    });
  }
});

// Prescription Text Explanation
router.post("/prescription", async (req, res) => {
  const { text, language } = req.body;

  try {
    const prompt = `
      Explain this prescription in ${language} using simple terms:
      ${text}
      
      Include:
      1. Medication purpose in 1 sentence
      2. Dosage instructions clearly
      3. Potential side effects to watch for
      4. Important warnings
      
      Use bullet points and keep under 300 words.
      Format the response in markdown with bold headings for each section.
      Respond in ${language}.
    `;

    const result = await model.generateContent([prompt]);
    const explanation = result.response.candidates[0].content.parts[0].text;
    
    res.json({ explanation });
  } catch (error) {
    console.error("Prescription explanation error:", error);
    res.status(500).json({ 
      error: "Error explaining prescription",
      explanation: language === "hi" ?
        "मुझे इस प्रिस्क्रिप्शन को समझाने में समस्या आई। कृपया पुनः प्रयास करें।" :
        "I had trouble explaining this prescription. Please try again."
    });
  }
});

// Prescription Image OCR and Explanation
router.post("/ocr-prescription", upload.single("prescription"), async (req, res) => {
  const { language } = req.body;
  const filePath = req.file.path;

  try {
    // OCR Processing
    const { data: { text } } = await Tesseract.recognize(
      filePath,
      language === "hi" ? "hin" : "eng",
      { logger: m => console.log(m) }
    );

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    // AI Explanation
    const prompt = `
      Explain this OCR-extracted prescription in ${language}:
      ${text}
      
      Provide:
      1. Medication names and purposes
      2. Clear dosage instructions
      3. Potential side effects
      4. Important warnings
      
      Format in markdown with bullet points.
      Keep the explanation simple and under 250 words.
      Respond in ${language}.
    `;

    const result = await model.generateContent([prompt]);
    const explanation = result.response.candidates[0].content.parts[0].text;
    
    res.json({ explanation });
  } catch (error) {
    console.error("OCR prescription error:", error);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ 
      error: "Error processing prescription",
      explanation: language === "hi" ?
        "प्रिस्क्रिप्शन प्रोसेस करने में त्रुटि हुई। कृपया पुनः प्रयास करें।" :
        "Error processing prescription. Please try again."
    });
  }
});

// Symptom Checker
router.post("/symptom", async (req, res) => {
  const { symptoms, language } = req.body;
  
  try {
    const prompt = `
      Analyze these symptoms in ${language}:
      ${symptoms}
      
      Provide:
      1. Possible conditions (list 2-3 most likely)
      2. Recommended next steps
      3. When to seek urgent care
      4. General advice
      
      Format in markdown with clear headings.
      Keep response under 300 words and in ${language}.
    `;

    const result = await model.generateContent([prompt]);
    const advice = result.response.candidates[0].content.parts[0].text;
    
    // Doctor recommendation logic
    const symptomToSpecialization = {
      headache: "Neurologist",
      fever: "General Practitioner",
      cough: "Pulmonologist",
      "chest pain": "Cardiologist",
      "stomach ache": "Gastroenterologist",
      // Add more mappings as needed
    };

    const extractedSpecializations = Object.keys(symptomToSpecialization)
      .filter(symptom => symptoms.toLowerCase().includes(symptom))
      .map(symptom => symptomToSpecialization[symptom]);

    let suggestedDoctors = [];
    if (extractedSpecializations.length > 0) {
      const doctors = await Doctor.find({
        specialization: { $in: extractedSpecializations }
      }).limit(3);

      suggestedDoctors = await Promise.all(
        doctors.map(async doctor => {
          const userInfo = await User.findById(doctor.userId);
          return {
            name: `${userInfo.firstname} ${userInfo.lastname}`,
            specialization: doctor.specialization
          };
        })
      );
    }

    res.json({ advice, suggestedDoctors });
  } catch (error) {
    console.error("Symptom checker error:", error);
    res.status(500).json({ 
      error: "Error analyzing symptoms",
      advice: language === "hi" ?
        "मुझे आपके लक्षणों का विश्लेषण करने में समस्या आई। कृपया पुनः प्रयास करें।" :
        "I had trouble analyzing your symptoms. Please try again."
    });
  }
});

module.exports = router;