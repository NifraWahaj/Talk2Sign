const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Initialize Firebase Admin SDK
const serviceAccount = require("./path/to/serviceAccountKey.json"); // Replace with your Firebase service account key file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id.firebaseio.com", // Replace with your database URL
});

const db = admin.firestore();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // Replace with your email provider (e.g., Gmail, Yahoo)
  auth: {
    user: "your-email@gmail.com", // Your email address
    pass: "your-email-password-or-app-password", // Your email password or app-specific password
  },
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint to generate and send reset code
app.post("/send-reset-code", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    // Generate a 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Store the code in Firestore with a timestamp
    const codeDocRef = db.collection("resetCodes").doc(email);
    await codeDocRef.set({
      code,
      createdAt: admin.firestore.Timestamp.now(),
    });

    // Send the code via email using Nodemailer
    const mailOptions = {
      from: '"Talk2Sign Support" <your-email@gmail.com>', // Replace with your email
      to: email,
      subject: "Your Password Reset Code",
      text: `Your password reset code is ${code}. It will expire in 10 minutes.`,
      html: `<p>Your password reset code is <strong>${code}</strong>. It will expire in 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reset code sent to ${email}`);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending reset code:", error);
    return res.status(500).json({ error: "Failed to send reset code." });
  }
});

// Endpoint to verify the reset code
app.post("/verify-reset-code", async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required." });
  }

  try {
    const codeDocRef = db.collection("resetCodes").doc(email);
    const codeDoc = await codeDocRef.get();

    if (!codeDoc.exists) {
      return res.status(400).json({ error: "Invalid code. Please try again." });
    }

    const { code: storedCode, createdAt } = codeDoc.data();
    const currentTime = admin.firestore.Timestamp.now();

    // Check if the code is expired (10-minute expiration)
    const isExpired = currentTime.seconds - createdAt.seconds > 600;

    if (isExpired) {
      return res.status(400).json({ error: "The code has expired. Please request a new one." });
    }

    if (storedCode === code) {
      console.log("Code verified successfully.");
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ error: "Invalid code. Please try again." });
    }
  } catch (error) {
    console.error("Error verifying reset code:", error);
    return res.status(500).json({ error: "Failed to verify reset code." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
