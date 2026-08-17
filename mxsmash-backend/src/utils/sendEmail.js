import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async ({ to, subject, html }) => {
  console.log(" DEBUG: BREVO_API_KEY is:", process.env.BREVO_API_KEY ? "FOUND " : "MISSING ");
  console.log(" DEBUG: BREVO_SENDER_EMAIL is:", process.env.BREVO_SENDER_EMAIL || "MISSING ");
  console.log(" DEBUG: BREVO_SENDER_NAME is:", process.env.BREVO_SENDER_NAME || "MISSING ");

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: process.env.BREVO_SENDER_NAME,
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(" Email sent successfully to:", to);
    return response.data;
  } catch (error) {
    console.error(" BREVO FULL ERROR OBJECT START ");
    console.error("Error Message:", error.message);
    if (error.response) {
      console.error("Brevo API Status:", error.response.status);
      console.error("Brevo API Response Data:", JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error("No response received from Brevo, request was:", error.request);
    } else {
      console.error("Unexpected error setting up request:", error.message);
    }
    console.error(" BREVO FULL ERROR OBJECT END ");
    throw error; 
  }
};

export default sendEmail;