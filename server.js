const express = require('express');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const twilio = require('twilio');
const app = express();
const port = 3000;
app.use(bodyParser.json());

// Twilio credentials
const accountSid = 'AC2594fba7b43786ddd4f7ea62e0b3db0e';
const authToken = '7da3c011dec7e22deaff385a0737f758';
const twilioPhoneNumber = '+14354146280';
const twilioClient = new twilio(accountSid, authToken);

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'JareD6470',
  database: 'school_Management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



// Create the new_transcribers table if not exists
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS new_transcribers (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
  )
`;

// Create the otps table if not exists
const createOtpTableQuery = `
  CREATE TABLE IF NOT EXISTS otps (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    username VARCHAR(255) NOT NULL,
    otp INT NOT NULL,
    expiry_time DATETIME NOT NULL
  )
`;

// Create the management table if not exists
const createmTableQuery = `
  CREATE TABLE IF NOT EXISTS gmanagement (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  )
`;
// Use pool.promise() to get a promise-based API for cleaner code
pool.promise().query(createTableQuery)
  .then(([rows, fields]) => {
    console.log('Table created or already exists');

    
    // Serve static files from the 'public' directory
    app.use(express.static(path.join(__dirname, 'public')));

    // Serve the mregister2 file file
    app.get('/mregister2', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'mregister2.html'));
    });

    // Serve the mregister2 file file
    app.get('/maccount2', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'maccount2.html'));
    });

    // Serve the workdashboard file file
    app.get('/workdashboard', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'workdashboard.html'));
    });


    // Serve the mlogin2 file
    app.get('/mlogin2', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'mlogin2.html'));
    });

    // Serve the success verification file
    app.get('/success_verification', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'success_verification.html'));
    });
    
    // Serve the account creation file
    app.get('/accountcreated', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'accountcreated.html'));
    });
    
    // Serve the registration form
    app.get('/register', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'register.html'));
    });

     // Serve the account file
    app.get('/account', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'account.html'));
    });

    // Serve the workdashboard file
    app.get('/workdashboard', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'workdashboard.html'));
    });

    // Serve the start file
    app.get('/start', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'start.html'));
    });

    // Serve the login form
    app.get('/login', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'login.html'));
    });


    app.post('/maccount2', express.urlencoded({ extended: true }), async (req, res) => {
  const { transactionid, transactionammount } = req.body;

  // Validate transactionid
  if (!transactionid) {
    res.status(400).send('Transaction ID is required.');
    return;
  }

  // Check if the username already exists
  const checkTransactionIdQuery = `SELECT * FROM deposits WHERE transactionid = ?`;
  const [usernameResults] = await pool.promise().execute(checkTransactionIdQuery, [transactionid]);

  if (usernameResults.length > 0) {
    res.redirect('/maccount2?error=qjrfapps_gdfajsd_yrkwaqtefd_hdfreaujerw');
    return;
  }

  // Insert data into the new_transcribers table
  const timestamp = new Date();
  const insertQuery = `
    INSERT INTO deposits (transactionid, amount, date, status, username, status2)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  try {
    const [insertResults] = await pool.promise().execute(insertQuery, [transactionid, transactionammount, timestamp, 'unused', '', '']);
    console.log('Success:', insertResults);
    res.redirect('/maccount2?error=hdjhhwjs8748-uuey-7376ghgdsg-nncb');
   // res.redirect('/maccount2');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.redirect('/maccount2?error=squyta_kiyvcmcs_ytsdwqzp_lmorodr');
  }
});


    // Handle registration form submission and insert data into the database
app.post('/register', express.urlencoded({ extended: true }), async (req, res) => {
  const { username, email, phone_number, password, confirm_password } = req.body;

  // Check if the username already exists
  const checkUsernameQuery = `SELECT * FROM new_transcribers WHERE username = ?`;
  const [usernameResults] = await pool.promise().execute(checkUsernameQuery, [username]);

  if (usernameResults.length > 0) {
    //res.send('Username already exists. Please choose a different username.');
    res.redirect('/register?error=qjrfapps_gdfajsd_yrkwaqtefd_hdfreaujerw');
    return;
  }

  // Check if the email already exists
  const checkEmailQuery = `SELECT * FROM new_transcribers WHERE email = ?`;
  const [emailResults] = await pool.promise().execute(checkEmailQuery, [email]);

  if (emailResults.length > 0) {
    //res.send('Email already exists. Please choose a different email address.');
    res.redirect('/register?error=pdr_hdfwqsfat_jftgsre_urtoyrsg');
    return;
  }

  // Check if the phone number already exists
  const checkPhoneQuery = `SELECT * FROM new_transcribers WHERE phone_number = ?`;
  const [phoneResults] = await pool.promise().execute(checkPhoneQuery, [phone_number]);

  if (phoneResults.length > 0) {
   // res.send('Phone number already exists. Please choose a different phone number.');
    res.redirect('/register?error=hfryts_knfekg_kqwasy_opvrw');
    return;
  }

  // Check if passwords match
  if (password !== confirm_password) {
    res.send('Passwords do not match.');
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert data into the new_transcribers table
  const insertQuery = `
    INSERT INTO new_transcribers (username, email, phone_number, password)
    VALUES (?, ?, ?, ?)
  `;
  try {
    const [insertResults] = await pool.promise().execute(insertQuery, [username, email, phone_number, hashedPassword]);
    console.log('User registered successfully:', insertResults);
    // res.send('User registered successfully.');
    // Generate and send OTP
        //const otp = generateOtp();
       // sendOtp(phone_number, otp);
        //storeOtp(username, otp);

        //res.redirect('/otp?username=' + username);
    res.redirect('/accountcreated');
  } catch (error) {
    console.error('Error inserting data:', error);
    //res.send('Error registering user.');
    res.redirect('/register?error=squyta_kiyvcmcs_ytsdwqzp_lmorodr');
  }
});

// Handle mregister2 form submission and insert data into the database
app.post('/mregister2', express.urlencoded({ extended: true }), async (req, res) => {
  const { username, email, phone_number, password, confirm_password } = req.body;

  // Check if the username already exists
  const checkUsernameQuery = `SELECT * FROM gmanagement WHERE username = ?`;
  const [usernameResults] = await pool.promise().execute(checkUsernameQuery, [username]);

  if (usernameResults.length > 0) {
    //res.send('Username already exists. Please choose a different username.');
    res.redirect('/mregister2?error=qjrfapps_gdfajsd_yrkwaqtefd_hdfreaujerw');
    return;
  }
  
  // Check if passwords match
  if (password !== confirm_password) {
    res.send('Passwords do not match.');
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert data into the new_transcribers table
  const insertQuery = `
    INSERT INTO gmanagement (username, password)
    VALUES (?, ?)
  `;
  try {
    const [insertResults] = await pool.promise().execute(insertQuery, [username, hashedPassword]);
    console.log('Success:', insertResults);
    
    res.redirect('/accountcreated');
  } catch (error) {
    console.error('Error inserting data:', error);
    //res.send('Error registering user.');
    res.redirect('/register?error=squyta_kiyvcmcs_ytsdwqzp_lmorodr');
  }
});


 // Serve the OTP verification form
    app.get('/otp', (req, res) => {
      const username = req.query.username;
      res.sendFile(path.join(__dirname, 'public', 'otp.html'));
    });

     // Handle OTP verification form submission
    app.post('/otp', express.urlencoded({ extended: true }), async (req, res) => {
      const username = req.body.username;
      const otp = req.body.otp;

      // Check if the provided OTP is valid
      const otpResults = await verifyOtp(username, otp);

      if (otpResults) {
        res.redirect('/success_verification');
      } else {
        res.redirect('?error=invalid_otp&username=' + username);
      }
    });


    // Generate a secure random key
const generateRandomKey = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

const secretKey = generateRandomKey(32);

app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
  // Other configurations...
}));


    // Handle login form submission and validate user credentials
app.post('/login', express.urlencoded({ extended: true }), async (req, res) => {
  const { username, password } = req.body;

  // Query the database for the user
  const getUserQuery = `
    SELECT * FROM new_transcribers
    WHERE username = ? 
  `;

  try {
    const [results, fields] = await pool.promise().execute(getUserQuery, [username]);

    if (results.length === 0) {
      res.redirect('/login?error=user_not_found');
    } else {
      const user = results[0];

      // Check if the account is verified
      //if (user.account_status === 'verified') {
        // Check if the provided password matches the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          // Update account_status to 'verified'
          //const updateStatusQuery = `
            //UPDATE new_transcribers
            //SET account_status = 'verified'
           // WHERE username = ?
         // `;
         // await pool.promise().execute(updateStatusQuery, [username]);

          // Set the session and redirect to the account page
          req.session.username = user.username;
          res.redirect('/workdashboard');
        } else {
          res.redirect('/login?error=incorrect_password');
        }
      //} else {
        // Redirect to OTP verification page if the account is not verified
       // res.redirect('/otp.html');
      }
    
  } catch (error) {
    console.error('Error checking user:', error);
    res.redirect('/login?error=server_error');
  }
});


// Handle mlogin2 form submission and validate user credentials
app.post('/mlogin2', express.urlencoded({ extended: true }), async (req, res) => {
  const { username, password } = req.body;

  // Query the database for the user
  const getUserQuery = `
    SELECT * FROM gmanagement
    WHERE username = ? 
  `;

  try {
    const [results, fields] = await pool.promise().execute(getUserQuery, [username]);

    if (results.length === 0) {
      res.redirect('/mlogin2?error=user_not_found');
    } else {
      const user = results[0];

      
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          
          req.session.username = user.username;
          res.redirect('/maccount2');
        } else {
          res.redirect('/mlogin2?error=incorrect_password');
        }
      //} else {
        // Redirect to OTP verification page if the account is not verified
       // res.redirect('/otp.html');
      }
    
  } catch (error) {
    console.error('Error checking user:', error);
    res.redirect('/mlogin2?error=server_error');
  }
});


// Handle POST request for /verifyPayment
app.post('/verifyPayment', (req, res) => {
  const transactionId = req.body.transactionId;
  

  // Check if the transactionId exists in the deposits table
  pool.query('SELECT * FROM deposits WHERE transactionid = ?', [transactionId], (err, results) => {
    if (err) {
      console.error('Error querying deposits table:', err);
      res.status(500).json({ error: 'There was an error. Please try again' });
    } else if (results.length === 0) {
      // TransactionId not found
      res.status(400).json({ error: 'No payment found with that ID. Please try again after 5 minutes' });
    } else {
      const deposit = results[0];
      if (deposit.status === 'used') {
        // TransactionId already used
        res.status(400).json({ error: 'This M-pesa Code has already been used' });
      } else {
        // Update the status to 'used'
        const username = req.session.username;
        pool.query('UPDATE deposits SET status = ?, username = ?, status2 = ? WHERE transactionid = ?', ['used', username, 'Success', transactionId], (err) => {
          if (err) {
            console.error('Error updating status in deposits table:', err);
            res.status(500).json({ error: 'There was an error. Please try again' });
          } else {
            // Update balance in new-transcribers table
            const username = req.session.username; // Assuming you have user session information
            pool.query('UPDATE new_transcribers SET ballance = ballance + ? WHERE username = ?', [deposit.amount, username], (err) => {
              if (err) {
                console.error('Error updating balance in new_transcribers table:', err);
                res.status(500).json({ error: 'There was an error. Please try again' });
              } else {
                // Success
                res.json({ success: true });
              }
            });
          }
        });
      }
    }
  });
});


app.post('/withdraw', (req, res) => {
  const username = req.session.username;
  const withdrawalatammount = req.body.withdrawalatammount;
  const phonenumbertext = req.body.phonenumbertext;

  // Perform any additional validation on the withdrawal amount, user session, or phonenumbertext if needed

  // Check if phonenumbertext is not undefined
  if (phonenumbertext === undefined || phonenumbertext.trim() === '') {
    res.status(400).json({ success: false, error: 'Phonenumber is required' });
    return;
  }

  // Start a transaction to ensure consistency
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      res.json({ success: false });
      return;
    }

    connection.beginTransaction((beginTransactionErr) => {
      if (beginTransactionErr) {
        console.error('Error starting database transaction:', beginTransactionErr);
        res.json({ success: false });
        connection.release();
        return;
      }

      // Insert withdrawal data into the withdrawals table
      const insertWithdrawalQuery = 'INSERT INTO withdrawals (username, amount, contact, date, status) VALUES (?, ?, ?, NOW(), "Pending")';

      connection.query(insertWithdrawalQuery, [username, withdrawalatammount, phonenumbertext], (insertWithdrawalQueryErr) => {
        if (insertWithdrawalQueryErr) {
          console.error('Error during withdrawal insertion:', insertWithdrawalQueryErr);
          // Rollback the transaction in case of an error
          connection.rollback(() => {
            res.json({ success: false });
            connection.release();
          });
          return;
        }

        // Update balance in new_transcribers table
        const updateBalanceQuery = 'UPDATE new_transcribers SET ballance = ballance - ? WHERE username = ?';

        connection.query(updateBalanceQuery, [withdrawalatammount, username], (updateBalanceQueryErr) => {
          if (updateBalanceQueryErr) {
            console.error('Error updating balance in new_transcribers table:', updateBalanceQueryErr);
            // Rollback the transaction in case of an error
            connection.rollback(() => {
              res.json({ success: false });
              connection.release();
            });
            return;
          }

          // Commit the transaction if all queries succeed
          connection.commit((commitErr) => {
            if (commitErr) {
              console.error('Error committing database transaction:', commitErr);
              res.json({ success: false });
            } else {
              res.json({ success: true });
            }
            connection.release();
          });
        });
      });
    });
  });
});






// Endpoint to fetch the username and account type
app.get('/get-username', (req, res) => {
  const username = req.session.username;
  const getUserInfoQuery = 'SELECT username, account_status, current_account, ballance, phone_number, email FROM new_transcribers WHERE username = ?';

  pool.promise().execute(getUserInfoQuery, [username])
    .then(([results, fields]) => {
      if (results.length > 0) {
        const userInfo = {
          username: results[0].username,
          accountType: results[0].account_status,
          currentAccount: results[0].current_account,
          accountBallance: results[0].ballance,
          accountPhonenumber: results[0].phone_number,
          accountEmail: results[0].email,

          
        };
        res.json(userInfo);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});


// Endpoint to fetch user transactions
app.get('/get-user-transactions', (req, res) => {
  const username = req.session.username;
  const getUserInfoQuery = 'SELECT username, amount, date, status2 FROM deposits WHERE username = ? ORDER BY date DESC';

  pool.promise().execute(getUserInfoQuery, [username])
    .then(([results, fields]) => {
      if (results.length > 0) {
        // Map the results to an array of transactions
        const transactions = results.map(result => ({
          username: result.username,
          depositAmount: result.amount,
          depositDate: result.date,
          depositStatus: result.status2,
        }));
        res.json({ transactions });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});


// Endpoint to fetch user transactions
app.get('/get-user-withdrawals', (req, res) => {
  const username = req.session.username;
  const getUserInfoQuery = 'SELECT username, amount, date, status FROM withdrawals WHERE username = ? ORDER BY date DESC';

  pool.promise().execute(getUserInfoQuery, [username])
    .then(([results, fields]) => {
      if (results.length > 0) {
        // Map the results to an array of transactions
        const transactions = results.map(result => ({
          username: result.username,
          withdrawalAmount: result.amount,
          withdrawalDate: result.date,
          withdrawalStatus: result.status,
        }));
        res.json({ transactions });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});



// Endpoint to fetch the musername and account type
app.get('/get-musername', (req, res) => {
  const username = req.session.username;
  const getUserInfoQuery = 'SELECT username  FROM gmanagement WHERE username = ?';

  pool.promise().execute(getUserInfoQuery, [username])
    .then(([results, fields]) => {
      if (results.length > 0) {
        const userInfo = {
          username: results[0].username,
          
        };
        res.json(userInfo);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

/// Endpoint to initiate M-Pesa payment
app.post('/initiate-mpesa-payment', async (req, res) => {
  try {
    // Use the M-Pesa simulation code here
    let unirest = require('unirest');
    const response = await unirest
      .post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest')
      .headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YAM8ZQdbYtDzOPgKr1SGzgq7Qbtt'
      })
      .send({
        "BusinessShortCode": 174379,
        "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjQwMTEwMTUzNjMw",
        "Timestamp": "20240110153630",
        "TransactionType": "CustomerPayBillOnline",
        "Amount": 200,
        "PartyA": 254704684936,
        "PartyB": 174379,
        "PhoneNumber": 254704684936,
        "CallBackURL": "https://mydomain.com/path",
        "AccountReference": "JM",
        "TransactionDesc": "WRITTING"
      });

    if (response.error) {
      console.error(response.error);
      throw new Error(response.error);
    }

    res.json({ result: response.raw_body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add this route after the other routes
app.get('/logout', (req, res) => {
  // Destroy the user's session to log them out
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      // Handle the error as needed
    } else {
      // Redirect the user to the login page after logout
      res.redirect('/login');
    }
  });
});




    // Start the server after the table has been created
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error creating table:', err);
  });

  

  // Function to generate a 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Function to send OTP via Twilio
function sendOtp(phoneNumber, otp) {
  twilioClient.messages.create({
    body: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    from: twilioPhoneNumber,
    to: phoneNumber
  })
  .then(message => console.log('OTP sent:', message.sid))
  .catch(error => console.error('Error sending OTP:', error));
}

// Function to store OTP in the database
async function verifyOtp(username, otp) {
  const checkOtpQuery = 'SELECT * FROM otps WHERE username = ? AND otp = ? AND expiry_time > ?';

  try {
    const currentDate = new Date();
    console.log('Current Date:', currentDate);

    const [otpResults] = await pool.promise().execute(checkOtpQuery, [username, otp, currentDate || null]);
    console.log('OTP Results:', otpResults);

    if (otpResults.length > 0) {
      // Clear the used OTP from the database
      const clearOtpQuery = 'DELETE FROM otps WHERE username = ?';
      await pool.promise().execute(clearOtpQuery, [username]);

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error verifying OTP:', error);

    // Log the parameters to help identify the issue
    console.log('Query Parameters:', [username, otp, currentDate || null]);

    return false;
  }
}
  