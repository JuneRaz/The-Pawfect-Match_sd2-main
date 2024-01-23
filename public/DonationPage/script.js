// JavaScript to toggle visibility of donation instructions
const shelters = document.querySelectorAll('.shelter');

shelters.forEach((shelter) => {
    shelter.addEventListener('click', () => {
        shelter.querySelector('.hidden').classList.toggle('visible');
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Fetch user profile data
    fetch('/profile', {
        method: 'POST',
        credentials: 'same-origin',
    })
    .then(response => response.json())
    .then(data => {
        const avatarContainer = document.getElementById('avatarContainer'); 
        const applicantNameInput = document.getElementById('Username');
    
        // Assuming the server response structure has a property 'applicantData'
        if (data.appdata && data.appdata.length > 0) {
            const applicantData = data.appdata[0];

            // Populate form fields
            applicantNameInput.textContent = applicantData.username; 
            avatarContainer.src = `data:image/jpeg;base64,${applicantData.profpic}`;
            avatarContainer.alt = 'user profile picture';
        }
       
    })
    .catch(error => {
        console.error('Error fetching profile data:', error);
        // Handle the error, e.g., display an error message to the user
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const serviceButton = document.getElementById("serviceButton");

    serviceButton.addEventListener("click", function () {
        // Replace "your-service-url" with the actual URL you want to navigate to
        window.location.href = "/Service";
    });
});