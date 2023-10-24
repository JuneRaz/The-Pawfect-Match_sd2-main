document.getElementById('myForm').addEventListener('submit', handleSubmit);

function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const form = document.querySelector('form');
    const formData = new FormData(form);

    // Access the Pet Picture file input element by its id and add it to the FormData
    for (item of formData) {
        console.log(item[0], item[1]);
    }

    const url = 'http://localhost:7000/insert';
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
        return responseData;
    } catch (error) {
        console.error('Error occurred:', error);
    }
}
