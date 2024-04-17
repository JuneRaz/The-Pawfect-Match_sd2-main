var settingsmenu = document.querySelector(".settings-menu");



function settingsMenuToggle(){
    settingsmenu.classList.toggle("settings-menu-height");
}





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
        const avatarContainer1 = document.getElementById('avatarContainer1'); 
        const avatarContainer2 = document.getElementById('avatarContainer2'); 
        const applicantNameInput1 = document.getElementById('Username1');
    
        // Assuming the server response structure has a property 'applicantData'
        if (data.appdata && data.appdata.length > 0) {
            const applicantData = data.appdata[0];

            // Populate form fields
            applicantNameInput.textContent = applicantData.fname; 
            applicantNameInput1.textContent = applicantData.fname; 
            avatarContainer.src = `data:image/jpeg;base64,${applicantData.profpic}`;
            avatarContainer.alt = 'user profile picture';

            if(applicantData.profpic){
                avatarContainer1.src = `data:image/jpeg;base64,${applicantData.profpic}`;
                avatarContainer.src = `data:image/jpeg;base64,${applicantData.profpic}`;
                avatarContainer2.src = `data:image/jpeg;base64,${applicantData.profpic}`;
            }
            else{
                avatarContainer1.src = "/HomePage/images/pp.png";
                avatarContainer.src = "/HomePage/images/pp.png";
                
            }
           

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