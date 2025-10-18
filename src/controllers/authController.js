const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { secretKey } = require('../config');
const { v4: uuidv4 } = require('uuid');

// Nodemailer
const nodemailer = require('nodemailer');
// Vonage
// const { Vonage } = require('@vonage/server-sdk'); // Commented out as it's no longer used

// Configure Gmail transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'youvote7@gmail.com',
    pass: 'rkwx gatx akot myxd', // App password
  },
});

// Configure Vonage - Commented out
/*
const vonage = new Vonage({
  apiKey: "30311db1",
  apiSecret: "f2kTHwjQ1D7ErTpI"
});
*/

// ------------------- REGISTER USER -------------------
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !phoneNumber) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (!/^[a-zA-Z]+$/.test(firstName) || !/^[a-zA-Z]+$/.test(lastName)) {
      return res.status(400).json({ error: 'Names must contain only letters.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    // Check uniqueness
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Email already in use.' });
    }
    if (await User.findOne({ phoneNumber })) {
      return res.status(400).json({ error: 'Phone number already in use.' });
    }

    // Generate OTP code for email only
    const emailCode = uuidv4().slice(0, 6);

    const user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      emailVerificationCode: emailCode,
      // phoneVerificationCode: phoneCode, // Removed phone verification
      emailVerified: false,
      // phoneVerified: false, // Removed phone verification
    });

    await user.save();

    // Send Email OTP
    await transporter.sendMail({
      from: 'youvote7@gmail.com',
      to: email,
      subject: 'Email Verification Code',
      text: `Welcome ${firstName}!\nYour email verification code is: ${emailCode}`,
    });
    console.log(`Email OTP sent to ${email}`);

    // Send Phone OTP - Commented out
    /*
    const to = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    const text = `Your verification code is: ${phoneCode}`;

    try {
      const resp = await vonage.sms.send({ to, from: "YouVote", text });
      console.log('Phone OTP sent successfully:', resp);
    } catch (err) {
      console.error('Error sending phone OTP:', err);
    }
    */

    return res.status(201).json({ message: 'User registered successfully. OTP sent to email.' });
  } catch (err) {
    console.error('registerUser error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ------------------- VERIFY EMAIL -------------------
exports.verifyEmail = async (req, res) => {
  try {
    // Only email and emailCode are needed now
    const { email, emailCode } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (user.emailVerificationCode !== emailCode) {
      return res.status(400).json({ error: 'Invalid email verification code.' });
    }
    
    // Phone verification check is removed
    /*
    if (user.phoneVerificationCode !== phoneCode) {
      return res.status(400).json({ error: 'Invalid phone verification code.' });
    }
    */

    user.emailVerified = true;
    // user.phoneVerified = true; // Removed phone verification
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully.' });
  } catch (err) {
    console.error('verify error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ------------------- LOGIN -------------------
exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    
    // Check only for email verification
    if (!user.emailVerified) {
      return res.status(403).json({ error: 'Email must be verified.' });
    }

    const loginId = uuidv4().slice(0, 18);
    const loginPassword = uuidv4().slice(0, 8);

    user.loginId = loginId;
    user.loginPassword = loginPassword;
    await user.save();

    // Send Email
    await transporter.sendMail({
      from: 'youvote7@gmail.com',
      to: email,
      subject: 'Login Credentials',
      text: `Login ID: ${loginId}\nPassword: ${loginPassword}`,
    });
    console.log(`Login credentials sent to email: ${email}`);

    // Send SMS - Commented out
    /*
    const to = user.phoneNumber.startsWith('+') ? user.phoneNumber : `+${user.phoneNumber}`;
    const text = `Login ID: ${loginId}\nPassword: ${loginPassword}`;

    try {
      const resp = await vonage.sms.send({ to, from: "YouVote", text });
      console.log('Login credentials sent via SMS:', resp);
    } catch (err) {
      console.error('Error sending SMS credentials:', err);
    }
    */

    return res.status(200).json({ message: 'Login ID and password sent to your email.' });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ------------------- VALIDATE LOGIN -------------------
exports.validateLogin = async (req, res) => {
  try {
    const { email, loginId, loginPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (user.loginId === loginId && user.loginPassword === loginPassword) {
      const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });

      user.loginId = undefined;
      user.loginPassword = undefined;
      await user.save();

      return res.status(200).json({ message: 'Login successful', user, token });
    } else {
      return res.status(400).json({ error: 'Invalid login ID or password.' });
    }
  } catch (err) {
    console.error('validateLogin error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};