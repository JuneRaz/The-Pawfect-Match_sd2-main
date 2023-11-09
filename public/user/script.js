document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.querySelector('.wrapper');
  const loginLink = document.querySelector('.login-link');
  const registerLink = document.querySelector('.register-link');
  const loginForm = document.querySelector(".form-box.login");
  const registerForm = document.querySelector(".form-box.register");
  const termsCheckbox = document.getElementById("terms-checkbox");
  const submitButton = document.getElementById("submit-button");


  // Function to show login form and hide registration form
  function showLoginForm() {
      loginForm.style.display = "block";
      registerForm.style.display = "none";
  }

  // Function to show registration form and hide login form
  function showRegisterForm() {
      loginForm.style.display = "none";
      registerForm.style.display = "block";
  }

  // Event listener for the "Register" link
  registerLink.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the link from navigating
      showRegisterForm(); // Show the registration form
      wrapper.classList.add('active');
  });
  showRegisterForm() 

  // Event listener for the "Login" link inside the registration form
  loginLink.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the link from navigating
      showLoginForm(); // Show the login form
      wrapper.classList.remove('active');
  });

  // Initially show the login form and hide the registration form
  showLoginForm();


// Retrieve the form and input elements

// Retrieve the form and input elements
/*
const form = document.getElementById('Ulogin');
const usernameInput = form.querySelector('input[name="username"]');
const passwordInput = form.querySelector('input[name="password"]');
const rememberMeCheckbox = document.getElementById('rememberMe');

// Check if "rememberMe" cookie exists
// Check if "rememberMe" cookie exists

const rememberMeCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('rememberMe='));
if (rememberMeCookie) {

  const userData = JSON.parse(localStorage.getItem('userData'));
  if (userData) {
    usernameInput.value = userData.username;
    passwordInput.value = userData.password;
  }
  rememberMeCheckbox.checked=true;
}

// Add an event listener for form submission
form.addEventListener('submit1', handleLogin);

function handleLogin(event) {
  event.preventDefault();

  const formData = new FormData(form);

  if (rememberMeCheckbox.checked) {
    // Set a cookie to remember the user
    document.cookie = 'rememberMe=true; max-age=2592000';

    // Save the user data to local storage
    const userData = {
      username: formData.get('username'),
      password: formData.get('password'),
    };
    localStorage.setItem('userData', JSON.stringify(userData));
  }
}
*/
  document.getElementById('Uregister').addEventListener('submit', handleSubmit);

  // Function to handle form submission
  function handleSubmit(event) {
      event.preventDefault(); 

     
      const form = document.getElementById("Uregister");
      const formData = new FormData(form);

      for (item of formData) {
          console.log(item[0], item[1], item[2], item[3]);
      }

      const url = 'http://localhost:7000/register';
      postData(url, formData);

      
  }

  // Add event listener to the submit button
  async function postData(url, data) {
      try {
          const urlEncoded = new URLSearchParams(data).toString();
          const response = await fetch(url, {
              method: "POST",
              body: urlEncoded,
              headers: {
                  'Content-type': 'application/x-www-form-urlencoded'
              }
          });

          const responseData = await response.json();
          console.log(responseData);
          return responseData;

      } catch (error) {
          console.error('Error occurred:', error);
      }
  }
});

