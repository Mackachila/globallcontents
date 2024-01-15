

        function showSection(sectionId) {
            // Hide all sections
            document.getElementById('accountsecction').style.display = 'none';
            document.getElementById('taskssecction').style.display = 'none';
            document.getElementById('walletsecction').style.display = 'none';
            document.getElementById('depositsecction').style.display = 'none';
            document.getElementById('withdrawalsecction').style.display = 'none';
           
            // Show the selected section
            document.getElementById(sectionId).style.display = 'block';
        }

  document.addEventListener('DOMContentLoaded', function () {
  console.log('Fetching username from server...');
  // Fetch the username from the session
  fetch('/get-username')
    .then(response => response.json())
    .then(data => {
      console.log('Fetched username from server:', data.username, data.accountType, data.currentAccount, data.accountBallance, data.accountPhonenumber, data.accountEmail );
      const username = data.username;
      const accountType = data.accountType;
      const currentAccount = data.currentAccount;
      const accountBallance = data.accountBallance;
      const accountPhonenumber = data.accountPhonenumber;
      const accountEmail = data.accountEmail;

      if (username) {
        // Display the username on the account page
        document.getElementById('username-display').textContent = ` ${username}`;
        document.getElementById('account-type').textContent = ` ${accountType}`;
        document.getElementById('current_account').textContent = ` ${currentAccount}`;
        document.getElementById('account_ballance').textContent = `KES.${accountBallance}`;
        document.getElementById('account_phonenumber').textContent = `${accountPhonenumber}`;
        document.getElementById('account_email').textContent = `${accountEmail}`;
        if (accountType == "verified")  {
        document.getElementById("account-type").style.color = "green";
        }else{
          document.getElementById("account-type").style.color = "red";
          document.getElementById("verifyaccount").style.display = "block";
        }
        if(currentAccount == "Free"){
        document.getElementById('tasks').textContent = ` 1`;
        document.getElementById('earnings').textContent = ` 0.50 $`;

        }else{
        document.getElementById('tasks').textContent = ` 2`;
        document.getElementById('earnings').textContent = ` 1 $`;
        }
      } else {
        // Redirect to the login page if the username is not available and not already on the login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    })
    .catch(error => {
      console.error('Error fetching username:', error);
      // Handle the error and maybe redirect to the login page
    });
});


document.addEventListener('DOMContentLoaded', function () {
  console.log('Fetching user transactions');
  // Fetch the username from the session
  fetch('/get-user-transactions')
    .then(response => response.json())
    .then(data => {
      console.log('Fetched transactions:', data.transactions);

      // Assuming data.transactions is an array of transactions
      const transactions = data.transactions;

      // Get the tbody element to append rows
      const transactionsBody = document.getElementById('transactions-body');
      if (transactions && transactions.length > 0) {
        // Loop through transactions and append rows
        transactions.forEach(transaction => {
          const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const date = new Date(transaction.depositDate);
        const options = { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
        dateCell.textContent = date.toLocaleString('en-US', options);
        row.appendChild(dateCell);

        const amountCell = document.createElement('td');
        amountCell.textContent = transaction.depositAmount;
        row.appendChild(amountCell);

        const statusCell = document.createElement('td');
        statusCell.textContent = transaction.depositStatus;
        row.appendChild(statusCell);

        transactionsBody.appendChild(row);
      });

    } else {
      // No transactions, hide the table and display a message
      document.getElementById('transactions-table').style.display = 'none';
      document.getElementById('notransactions').textContent = ` Your deposit history will show here`;
      document.getElementById('notransactions').style.display = 'block';
    }
      
    })
    .catch(error => {
      console.error('Error fetching user transactions:', error);
      // Handle the error as needed
    });
});


document.addEventListener('DOMContentLoaded', function () {
  console.log('Fetching user withdrawals');
  // Fetch the username from the session
  fetch('/get-user-withdrawals')
    .then(response => response.json())
    .then(data => {
      console.log('Fetched transactions:', data.transactions);

      // Assuming data.transactions is an array of transactions
      const transactions = data.transactions;

      // Get the tbody element to append rows
      const transactionsBody = document.getElementById('withdrawals-body');
      if (transactions && transactions.length > 0) {
        document.getElementById('nowithdrawals').textContent = ` Withdrawal History`;
        // Loop through transactions and append rows
        transactions.forEach(transaction => {
          const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const date = new Date(transaction.withdrawalDate);
        const options = { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
        dateCell.textContent = date.toLocaleString('en-US', options);
        row.appendChild(dateCell);

        const amountCell = document.createElement('td');
        amountCell.textContent = transaction.withdrawalAmount;
        row.appendChild(amountCell);

        const statusCell = document.createElement('td');
        statusCell.textContent = transaction.withdrawalStatus;
        row.appendChild(statusCell);

        transactionsBody.appendChild(row);
      });

    } else {
      // No transactions, hide the table and display a message
      document.getElementById('withdrawals-table').style.display = 'none';
      document.getElementById('nowithdrawals').textContent = ` Your withdrawal History will show here`;
      document.getElementById('nowithdrawals').style.display = 'block';
    }
      
    })
    .catch(error => {
      console.error('Error fetching user transactions:', error);
      // Handle the error as needed
    });
});


function verifyPayment() {
      const transactionId = document.getElementById('transactionId').value;
      if (transactionId =="") {

            document.getElementById("id-error-message").style.color = "red";
            document.getElementById("id-error-message").textContent = "Please fill in the transaction ID";
            return;
        } else {
            document.getElementById("id-error-message").textContent = "";
        

      // Make a POST request to /verifyPayment endpoint
      fetch('/verifyPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error); // Show error message to the user
        } else if (data.success) {
          alert('Deposit successful. Please reload the page to update your ballance'); // Show success message to the user
        }
      })
      .catch(error => {
        console.error('Error verifying payment:', error);
        alert('An error occurred. Please try again.'); // Show a generic error message
      });
    }
  }

  // Add this function to your existing JavaScript file
function withdraw() {
  const withdrawalatammount = document.getElementById("withdrawalatammount").value;
  const phonenumbertext = document.getElementById("phonenumbertext").value;

  // Perform validation on the withdrawal amount if needed

  // Fetch to the server
  fetch('/withdraw', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ withdrawalatammount, phonenumbertext }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Withdrawal request submitted successfully. It is pending approval.');
        pr();
        // You might want to update the UI or perform other actions here
      } else {
        alert('Withdrawal request failed. Please try again.');

        // Handle the error, update the UI, or perform other actions here
      }
    })
    .catch(error => {
      console.error('Error during withdrawal:', error);
      // Handle the error, update the UI, or perform other actions here
    });
}


  


// Function to initiate M-Pesa payment
function initiateMpesaPayment() {
  const phoneInput = document.getElementById('phoneInput').value;
  const amountInput = document.getElementById('amountInput').value;

  // Validate inputs
  if (!phoneInput || !amountInput) {
    alert('Please enter both phone number and amount.');
    return;
  }

  // Convert amount to cents (assuming M-Pesa uses cents)
  const amountInCents = parseInt(amountInput) * 100;

  // Call the function to simulate M-Pesa payment (replace with your actual logic)
  simulatePayment(amountInCents, phoneInput);
}

function initiateMpesaPayment() {
  // Make an AJAX request to your server to initiate the M-Pesa payment
  fetch('/initiate-mpesa-payment', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
      console.log(data); // Handle the response as needed
    })
    .catch(error => console.error(error));
}
// Add this code to your account.js file
document.addEventListener('DOMContentLoaded', () => {
  const getUsernameBtn = document.getElementById('get-username-btn');
  const usernameDisplay = document.getElementById('username-display2');

  // Event listener for the button click
  getUsernameBtn.addEventListener('click', async () => {
    try {
      // Fetch the username by ID from the server
      const response = await fetch('/get-username-by-id');
      const data = await response.json();

      // Display the result on the frontend
      if (data.username) {
        usernameDisplay.textContent = `Username: ${data.username}`;
      } else {
        usernameDisplay.textContent = 'User not found.';
      }
    } catch (error) {
      console.error('Error fetching username by ID:', error);
      // Handle the error and maybe display an error message on the frontend
    }
  });
});

// Add this code to your account.js file
document.addEventListener('DOMContentLoaded', () => {
  const verifyAccountBtn = document.getElementById('verify-account-btn');

  // Event listener for the button click
  verifyAccountBtn.addEventListener('click', async () => {
    try {
      // Fetch the account status from the server
      const response = await fetch('/verify-account');
      const data = await response.json();

      // Display the result or handle the redirection on the frontend
      if (data.error) {
        console.error('Error verifying account:', data.error);
        // Display an error message to the user (you can customize this based on your UI)
        alert('Error verifying account: ' + data.error);
      } else {
        // If there is no error, the server has already redirected to the success_verification page
      }
    } catch (error) {
      console.error('Error verifying account:', error);
      // Handle the error and maybe display an error message on the frontend
    }
  });
});

// Add this code to your existing account.js file
const logoutButton = document.getElementById('logoutsecction');

logoutButton.addEventListener('click', async () => {
  // Display a confirmation dialog
  const confirmLogout = window.confirm('Are you sure you want to logout?');

  if (confirmLogout) {
    // If the user confirms, make a request to the logout route on the server
    const response = await fetch('/logout', { method: 'GET' });

    if (response.ok) {
      // If the logout was successful, redirect the user to the login page
      window.location.href = '/login';
    } else {
      // Handle any errors that occurred during logout
      console.error('Error during logout:', response.statusText);
      // You can display an error message or handle it in another way
    }
  }
  // If the user cancels, do nothing
});

//deposit section
function dp(){
  const dpvalue = document.getElementById("depositammount").value;

  if(dpvalue < 500){
    document.getElementById("depositamount-error-message").style.color = "red";
    document.getElementById("depositamount-error-message").textContent = "Minimum deposit KES.500";
    document.getElementById('depositsteps').style.display = 'none';
    document.getElementById("payammount").value ="";
    
    return;
} else {
  document.getElementById("payammount").textContent = dpvalue;
    document.getElementById("depositamount-error-message").textContent = "";
    document.getElementById('depositsteps').style.display = 'block';
    

  }if(dpvalue > 450000){
    
    document.getElementById("depositamount-error-message").style.color = "red";
    document.getElementById("depositamount-error-message").textContent = "Maximum deposit KES.450000";
    document.getElementById('depositsteps').style.display = 'none';
    document.getElementById("payammount").value ="";
    
    return;
} else {
  document.getElementById("payammount").textContent = dpvalue;
    document.getElementById("depositamount-error-message").textContent = "";
    document.getElementById('depositsteps').style.display = 'block';
    
  }
}

//Withdrawal secction
function wd(){
  const wdvalue = document.getElementById("withdrawalatammount").value;
  const accountBallanceElement = document.getElementById("account_ballance");
  const accountBallanceText = accountBallanceElement.textContent;
  const accountBallance = parseFloat(accountBallanceText.replace('KES.', '').trim());
  const phonenumberElement = document.getElementById("account_phonenumber");
  const phonenumberText = phonenumberElement.textContent;

  if(wdvalue < 500){
    document.getElementById("withdrwal-error-message").style.color = "red";
    document.getElementById("withdrwal-error-message").textContent = "Minimum withdrawal KES.500";
    document.getElementById('withdrawalconfirmation').style.display = 'none';
    document.getElementById('withdrawalconfirmationbutton').style.display = 'none';
    document.getElementById("phonenumbertext").value = "";
    
   // document.getElementById("withdrawalatammount").value ="";
    
    return;
} else {
  document.getElementById("withdrwal-error-message").textContent = "";
  document.getElementById("withdrawalconfirmationatammount").textContent = wdvalue;
  document.getElementById("withdrawalphone").textContent = phonenumberText;
  document.getElementById("phonenumbertext").value = phonenumberText;
  document.getElementById('withdrawalconfirmation').style.display = 'block';
  document.getElementById('withdrawalconfirmationbutton').style.display = 'block';
  
  }if(wdvalue > 450000){
    
    document.getElementById("withdrwal-error-message").style.color = "red";
    document.getElementById("withdrwal-error-message").textContent = "Maximum withdrawal KES.450000";
    document.getElementById('withdrawalconfirmation').style.display = 'none';
    document.getElementById('withdrawalconfirmationbutton').style.display = 'none';
    document.getElementById("phonenumbertext").value = "";
  //  document.getElementById("withdrawalatammount").value ="";
    
    return;
} else {
  document.getElementById("withdrwal-error-message").textContent = "";
  document.getElementById("withdrawalconfirmationatammount").textContent = wdvalue;
  document.getElementById("withdrawalphone").textContent = phonenumberText;
  document.getElementById("phonenumbertext").value = phonenumberText;
  document.getElementById('withdrawalconfirmation').style.display = 'block';
  document.getElementById('withdrawalconfirmationbutton').style.display = 'block';
    
  }if(wdvalue > accountBallance){
    
    document.getElementById("withdrwal-error-message").style.color = "red";
    document.getElementById("withdrwal-error-message").textContent = "Insufficient funds. Your account ballance is KES."+ accountBallance;
    document.getElementById('withdrawalconfirmation').style.display = 'none';
    document.getElementById('withdrawalconfirmationbutton').style.display = 'none';
    document.getElementById("phonenumbertext").value = "";
    //document.getElementById("withdrawalatammount").value ="";
    
    return;
} else {
  document.getElementById("withdrwal-error-message").textContent = "";
  document.getElementById("withdrawalconfirmationatammount").textContent = wdvalue;
  document.getElementById("withdrawalphone").textContent = phonenumberText;
  document.getElementById("phonenumbertext").value = phonenumberText;
  document.getElementById('withdrawalconfirmation').style.display = 'block';
  document.getElementById('withdrawalconfirmationbutton').style.display = 'block';
    
  }
}
// Reload the current page
function pr() {
  
  location.reload();
}







    