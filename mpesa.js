const express = require('express');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const twilio = require('twilio');
const axios = require('axios');
const app = express();
const port = 3000;

// mpesa.js



// M-Pesa API credentials
const apiKey = 'mD5KGSpcCwlOwLsj2AMcJ00Bx4qEvAPN';
const consumerSecret = '1AtOyuuXC3JBBYLi';

// M-Pesa API endpoint
const mpesaEndpoint = 'https://api.safaricom.co.ke/mpesa/c2b/v1/simulate';

// Function to simulate a payment
async function simulatePayment(amount, phoneNumber) {
  const auth = Buffer.from(`${apiKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await axios.post(
      mpesaEndpoint,
      {
        ShortCode: 'N/A',
        CommandID: '950944',
        Amount: amount,
        Msisdn: phoneNumber,
        BillRefNumber: 'N/A',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error('M-Pesa API Error:', error.message);
  }
}

// Usage example
simulatePayment(amount, phoneNumber); // Replace with actual amount and phone number


