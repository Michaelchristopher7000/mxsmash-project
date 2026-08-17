// src/services/emailTemplates.js
import sendEmail from './sendEmail.js'; // adjust path as needed

export const sendWelcomeEmail = async (user) => {
  const html = `
    <h1>Welcome to Mxsmash Burger, ${user.name || 'User'}!</h1>
    <p>Thank you for registering. We're excited to have you.</p>
    <p>Start ordering your favorite burgers now!</p>
    <a href="${process.env.FRONTEND_URL}/menu">Browse Menu</a>
  `;
  await sendEmail({
    to: user.email,
    subject: 'Welcome to Mxsmash Burger!',
    html,
  });
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const html = `
    <h1>Reset Your Password</h1>
    <p>You requested a password reset for your Mxsmash account.</p>
    <p>Click the link below to set a new password. This link expires in 1 hour.</p>
    <a href="${resetLink}">Reset Password</a>
    <p>If you didn't request this, please ignore this email.</p>
  `;
  await sendEmail({
    to: user.email,
    subject: 'Reset Your Password - Mxsmash Burger',
    html,
  });
};

// Optional: login notification
export const sendLoginNotification = async (user) => {
  const html = `
    <p>Hi ${user.name || 'User'},</p>
    <p>We noticed a login to your Mxsmash account. If this was you, you can ignore this message.</p>
    <p>If this wasn't you, please reset your password immediately.</p>
  `;
  await sendEmail({
    to: user.email,
    subject: 'New Login to Your Mxsmash Account',
    html,
  });
};