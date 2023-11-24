document.getElementById('myForm').addEventListener('submit', handleSubmit);

function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const appemail = document.getElementById('appemail').value;
    window.localStorage.setItem('appemail', JSON.stringify(appemail));

    const form = document.querySelector('form');
    const formData = new FormData(form);

    // Access the Pet Picture file input element by its id and add it to the FormData
    for (item of formData) {
        console.log(item[0], item[1]);
    }

    const url = 'http://localhost:7000/adopt';
    postData(url, formData);
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
