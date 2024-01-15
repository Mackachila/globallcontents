
const registrationForm = document.getElementById("registration_form");

registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

  const registrationUsername = document.getElementById("username").value;
  const registrationEmail = document.getElementById("email").value;
  const registrationPhone = document.getElementById("phone_number").value;
  const registrationCountrylist = document.getElementById("countryList").value;
  const registrationPassword = document.getElementById("password").value;
  const registrationConfirmpassword = document.getElementById("confirm_password").value;

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password validation regex (at least 8 characters)
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  // Validate phone number
  //const phoneRegex =/^(07|01)\d{8}$/;
  // Validate Username
  const usernameRegex = /^[a-zA-Z0-9]{1,15}$/;
  //const usernameRegex = /^[a-zA-Z]+$/;

  // Validate email and password
  if (registrationUsername.trim() == "" || registrationEmail == "" || registrationPhone == "" || registrationPassword == "" || registrationConfirmpassword == "") {
    document.getElementById("registration-emptyfield-error").style.color = "red";
    document.getElementById("registration-emptyfield-error").textContent = "Please fill all the fields";
    return;
  } else {
    document.getElementById("registration-emptyfield-error").textContent = "";
  }
    if (!usernameRegex.test(registrationUsername)) {
            document.getElementById("registration-username-error").style.color = "red";
            document.getElementById("registration-username-error").textContent = "Username can only contain letters and numbers and not be too long. No spaces allowed";
            return;
        } else {
            document.getElementById("registration-username-error").textContent = "";
        }

  if (!emailRegex.test(registrationEmail)) {
            document.getElementById("registration-email-error").style.color = "red";
            document.getElementById("registration-email-error").textContent = "Please provide a valid email address.";
            return;
        } else {
            document.getElementById("registration-email-error").textContent = "";
        }
        

    if (!passwordRegex.test(registrationPassword)) {
        document.getElementById("registration-password-error").style.color = "red";
           document.getElementById("registration-password-error").textContent = "Password must be at least 8 characters and contain upercase and lowercase letters with special characters.";
            return;
        } else {
           document.getElementById("registration-password-error").textContent = "";
        }

     if (registrationPassword.trim() !== registrationConfirmpassword.trim()) {
            document.getElementById("registration-confirmpassword-error").style.color = "red";
            document.getElementById("registration-confirmpassword-error").textContent = "Your passwords do not match.";
            return;
        } else {
            document.getElementById("registration-confirmpassword-error").textContent = "";
        }

  

  // If validation passes, you can submit the form
  document.getElementById("registration_form").submit();

});

// Function to fetch and populate the country list
    function populateCountryList() {
        const countryList = document.getElementById('countryList');
        
        // Fetch country data from Rest Countries API
        fetch('https://restcountries.com/v2/all')
            .then(response => response.json())
            .then(data => {
                // Populate the select element with country names and codes
                data.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.alpha2Code;
                    option.text = `${country.name} (+${country.callingCodes[0]})`;
                    countryList.appendChild(option);
                });

                // Update phone number input immediately based on the initial selected country
                updatePhoneNumberInput();
            })
            .catch(error => console.error('Error fetching country data:', error));
    }
   
    // Populate the country list on page load
    document.addEventListener('DOMContentLoaded', populateCountryList);



// Function to handle login form submission
function login(event) {
  // Prevent the default form submission
  event.preventDefault();

  const loginUsername = document.getElementById("login_username").value;
  const loginPassword = document.getElementById("login_password").value;

  if (loginUsername.trim() == "" || loginPassword.trim() == "") {
    document.getElementById("login-emptyfield-error").style.color = "red";
    document.getElementById("login-emptyfield-error").textContent = "Please fill all the fields";
    return;
  } else {
    document.getElementById("login-emptyfield-error").textContent = "";
  }

  // Now, if the fields are not blank, you can manually submit the form
  document.getElementById("login_form").submit();
}

  window.onload = function () {
  const usernameElement = document.getElementById('username');

  // Fetch the username from the server or from the session if available
  fetch('/get-username')
    .then(response => response.json())
    .then(data => {
      const username = data.username;

      if (username) {
        // Display the username on the profile page
        usernameElement.textContent = username;
      } 
    })
    .catch(error => {
      console.error('Error fetching username:', error);
      // Handle the error and maybe redirect to the login page
      window.location.href = '/login';
    });
};
