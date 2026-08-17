import axios from "axios"; // ADDED FOR IP GEOLOCATION
import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// ---------- Helper: Send Welcome Email ----------
const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
      <h2 style="color: #d4a437;">Welcome to Mxsmash Burger!</h2>
      <p>Hi ${user.name},</p>
      <p>Thank you for registering. We're excited to have you.</p>
      <p>Start ordering your favorite burgers now!</p>
      <a href="${process.env.FRONTEND_URL}/menu" style="display: inline-block; background: #d4a437; color: #000; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">
        Browse Menu
      </a>
    </div>
  `;
  await sendEmail({
    to: user.email,
    subject: "Welcome to Mxsmash Burger!",
    html,
  });
};

// ---------- Helper: Send Login Notification (UPDATED) ----------
const sendLoginNotification = async (user, req) => {
  // 1. Get Device & IP info from the Express request
  const userAgent = req.headers["user-agent"] || "Unknown Device";
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.ip ||
    "Unknown IP";

  // 2. Look up location using a free IP API
  let location = "Unknown Location";
  try {
    const geoRes = await axios.get(
      `http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,isp`,
    );
    if (geoRes.data.status === "success") {
      location = `${geoRes.data.city}, ${geoRes.data.regionName}, ${geoRes.data.country}`;
    }
  } catch (geoError) {
    console.error("Could not fetch IP geolocation:", geoError.message);
  }

  // 3. Create the Reset Link (Sends them to your frontend forgot-password page)
  const resetLink = `${process.env.FRONTEND_URL}/forgot-password`;

  // 4. Build the HTML email
  const html = `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
      <h2 style="color: #d4a437;">Security Alert: New Login Detected</h2>
      <p>Hi ${user.name},</p>
      <p>We noticed a new login to your Mxsmash account.</p>
      
      <div style="background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 16px 0; border: 1px solid #e0e0e0;">
        <p style="margin: 4px 0;"><strong>📍 Location:</strong> ${location}</p>
        <p style="margin: 4px 0;"><strong>💻 Device:</strong> ${userAgent.substring(0, 60)}...</p>
        <p style="margin: 4px 0;"><strong>🌐 IP Address:</strong> ${ip}</p>
      </div>

      <p style="margin-top: 16px;">If this was you, you can safely ignore this message.</p>
      <p>If this <strong>wasn't</strong> you, please secure your account immediately.</p>
      
      <a href="${resetLink}" style="display: inline-block; background: #d4a437; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
        Reset Password Now
      </a>
      <p style="font-size: 12px; color: #888;">If the button doesn't work, copy and paste this URL: ${resetLink}</p>
    </div>
  `;

  // 5. Send the email
  await sendEmail({
    to: user.email,
    subject: "Security Alert: New Login to Your Mxsmash Account",
    html,
  });
};

// ---------- Controllers ----------

// @desc Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, avatarUrl: randomAvatar },
    });

    // Send welcome email (don't block response)
    try {
      await sendWelcomeEmail(user);
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);
    }

    const token = generateToken(user.id, user.role);

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      favoriteBurger: user.favoriteBurger,
      createdAt: user.createdAt,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Login user (UPDATED to pass req)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // (Optional) Send login notification with device info and reset link
    try {
      await sendLoginNotification(user, req); // CHANGED: Passed req here
    } catch (emailError) {
      console.error("Login notification email failed:", emailError);
    }

    const token = generateToken(user.id, user.role);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      favoriteBurger: user.favoriteBurger,
      createdAt: user.createdAt,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Request a password reset - sends an email with a reset link
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset Your Mxsmash Burger Password",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #d4a437;">Reset Your Password</h2>
          <p>Hi ${user.name},</p>
          <p>You requested to reset your password. Click the button below to set a new one. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #d4a437; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
            Reset Password
          </a>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (error) {
    console.error(" AUTH CONTROLLER ERROR START ");
    console.error("Full Error Object:", error);

    if (error.response) {
      console.error("Brevo API Response Error Data:", error.response.data);
    } else if (error.request) {
      console.error("No response from Brevo API:", error.request);
    } else {
      console.error("General Error Message:", error.message);
    }
    console.error(" AUTH CONTROLLER ERROR END ");

    res.status(500).json({ message: "Server error" });
  }
};

// @desc Reset password using a valid token
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
