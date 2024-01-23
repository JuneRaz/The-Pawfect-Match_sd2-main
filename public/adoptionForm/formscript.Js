document.getElementById('myForm').addEventListener('submit', handleSubmit);

function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const appemail = document.getElementById('appemail').value;
    window.localStorage.setItem('appemail', JSON.stringify(appemail));

    const form = document.querySelector('form');
    const formData = new FormData(form);

    // Access the Pet Picture file input element by its id and add it to the FormData
    const captchaInput = document.getElementById('u-input').value;
        if (captchaInput === captcha.innerHTML) {
          
          displayCaptcha(); // Regenerate a new CAPTCHA after successful validation
          for (item of formData) {
            console.log(item[0], item[1]);
        }
    
        const url = 'http://localhost:7000/adopt';
        postData(url, formData);
        alert("Request sent to owner")
        }   else {
          alert('Captcha is incorrect. Please copy the correct text provided.');
          // You can add additional logic here to handle incorrect login attempts
        }
}

// Add event listener to the submit button
async function postData(url, data) {
    try {
        const response = await fetch(url, {
            method: "POST",
            body: data, // Use the FormData directly
        });

        const responseData = await response.json();
        console.log(responseData);

        // Check if there is a message in the response
        if (responseData.message) {
            // Display an alert with the message
            alert(responseData.message);

            // Redirect the user or perform any other necessary actions
            window.location.href = "http://localhost:7000/Homepage";
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

function generateCaptcha() {
    let captchaText = "";
    const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    // Generate captcha for a length of 5 with random characters
    for (let i = 0; i < 5; i++) {
        captchaText += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }

    return captchaText;
}

function displayCaptcha() {
    captcha = document.getElementById("image");
    let uniquechar = "";
 
    const randomchar =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
    // Generate captcha for length of
    // 5 with random character
    for (let i = 1; i < 5; i++) {
        uniquechar += randomchar.charAt(
            Math.random() * randomchar.length)
    }
 
    // Store generated input
    captcha.innerHTML = uniquechar;
  }