document.addEventListener("DOMContentLoaded", function () {
    // (unchanged code)

    // Update profile information dynamically
    fetch('/profile', {
        method: 'POST',
        credentials: 'same-origin', // Include cookies in the request
    })
    .then(response => response.json())
    .then(data => {
        const userNameElement = document.getElementById('userName');
        const userDescriptionElement = document.getElementById('userDescription');
        const userEmailElement = document.getElementById('userEmail');
        const welcomeMessageElement = document.getElementById('welcomeMessage');
        const avatarContainer = document.getElementById('avatarContainer'); // Update the element ID

        if (data.appdata && data.appdata.length > 0) {
            const user = data.appdata[0];


            userNameElement.textContent = user.username;
            if (!user.description) {
                userDescriptionElement.innerHTML = `  <p id="userDescriptionLink" style="color: black; text-decoration: none; cursor: pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
                No description available, Kindly<br>tell us about yourself 
              </p>
              `;
            
            } else {
                userDescriptionElement.innerHTML = user.description;
            }
          


            
            userEmailElement.textContent = user.email;
            welcomeMessageElement.textContent = `Hey ${user.username}, welcome back`;

            // Check if profpic is empty
          
                avatarContainer.src = `data:image/jpeg;base64,${user.profpic}`;
                avatarContainer.alt = 'user profile picture';
     
        } else {
            // Handle the case where no profile data is available
            userNameElement.textContent = 'Guest';
            userDescriptionElement.textContent = 'No profile data available';
            userEmailElement.textContent = '';
            welcomeMessageElement.textContent = 'Hey there, welcome!';
        }
    })
    .catch(error => {
        console.error('Error fetching profile data:', error);
        // Handle the error, e.g., display an error message to the user
    });
});



