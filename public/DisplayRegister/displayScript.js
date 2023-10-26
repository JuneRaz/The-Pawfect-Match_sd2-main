// Fetch the pet data and display cards
fetch('/display', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        const petCardContainer = document.getElementById('petCardContainer');

        // Function to filter and display pet cards based on the search query
        function filterPets(searchQuery) {
            petCardContainer.innerHTML = ''; // Clear the previous display

            data.pets.forEach(pet => {
                const petGender = pet.gender.toLowerCase();
                if (
                    pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    pet.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    pet.size.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    petGender === searchQuery.toLowerCase()
                    
                ) {
                    const card = document.createElement('div');
                    card.classList.add('card');

                    // Card content (same as before)
                    card.innerHTML = `
                        <h2>${pet.petname}</h2>
                        <p><strong>Date:</strong> ${pet.date}</p>
                        <p><strong>Species:</strong> ${pet.species}</p>
                        <p><strong>Breed:</strong> ${pet.breed}</p>
                        <p><strong>Gender:</strong> ${pet.gender}</p>
                        <p><strong>Size:</strong> ${pet.size}</p>
                        <H2>Owner Info</h2>
                        <p><strong>Name:</strong> ${pet.name}</p>
                        <p><strong>Age:</strong> ${pet.age}</p>
                        <p><strong>Address:</strong> ${pet.address}</p>
                        <p><strong>Email:</strong> ${pet.email}</p>
                        <p><strong>No.:</strong> ${pet.mno}</p>
                    `;

                    // Create an <img> element for the pet picture
                    if (pet.petpic) {
                        const petPic = document.createElement('img');
                        petPic.src = `data:image/png;base64, ${pet.petpic.toString('base64')}`; // Use "image/jpeg" for JPG images

                        // Append the pet picture to the card
                        card.appendChild(petPic);
                    }

                    // Append the card to the container
                    petCardContainer.appendChild(card);
                }
            });
        }

        // Add an event listener for the search button
        const searchButton = document.getElementById('search-button');
        searchButton.addEventListener('click', function () {
            const searchInput = document.getElementById('search-input');
            const searchQuery = searchInput.value;
            filterPets(searchQuery);
        });

        filterPets('');
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });


//-----------------------------------------------------------------------------------------------

// Initialize genderFilter and sizeFilter
let genderFilter = '';
let sizeFilter = '';

// Function to filter and display pet cards based on breed, gender, and size
function filterPets(selectedBreed) {
    // Fetch and display pet cards based on the selected breed, gender, and size
    const queryParams = [];

    if (selectedBreed) {
        queryParams.push(`breed=${encodeURIComponent(selectedBreed)}`);
    }
    if (genderFilter) {
        queryParams.push(`gender=${encodeURIComponent(genderFilter)}`);
    }
    if (sizeFilter) {
        queryParams.push(`size=${encodeURIComponent(sizeFilter)}`);
    }

    const query = queryParams.join('&');

    fetch(`/display?${query}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            const petCardContainer = document.getElementById('petCardContainer');
            petCardContainer.innerHTML = ''; // Clear the previous display

            data.pets.forEach(pet => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <h2>${pet.petname}</h2>
                    <p><strong>Date:</strong> ${pet.date}</p>
                    <p><strong>Species:</strong> ${pet.species}</p>
                    <p><strong>Breed:</strong> ${pet.breed}</p>
                    <p><strong>Gender:</strong> ${pet.gender}</p>
                    <p><strong>Size:</strong> ${pet.size}</p>
                    <H2>Owner Info</h2>
                    <p><strong>Name:</strong> ${pet.name}</p>
                    <p><strong>Age:</strong> ${pet.age}</p>
                    <p><strong>Address:</strong> ${pet.address}</p>
                    <p><strong>Email:</strong> ${pet.email}</p>
                    <p><strong>No.:</strong> ${pet.mno}</p>
                `;

                if (pet.petpic) {
                    const petPic = document.createElement('img');
                    petPic.src = `data:image/png;base64, ${pet.petpic.toString('base64')}`;
                    card.appendChild(petPic);
                }

                petCardContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Your existing code for breed selection, search, and size selection
const form = document.querySelector(".form");
const selectBtn = form.querySelector(".select-btn");
const searchInp = form.querySelector("input");
const options = form.querySelector(".options");
let breedOptions = [];

// Rest of your existing code for breed selection, search, and size selection
// ...

// Event listener for gender selection
// Event listener for gender selection
const genderRadios = document.querySelectorAll('input[name="gender"]');
genderRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        genderFilter = radio.value;
        filterPets();
        selectBtn.firstElementChild.innerText = "Select"; // Reset the size dropdown to "Select"
    });
});

// Event listener for size dropdown
const sizeSelect = document.getElementById("size");
sizeSelect.addEventListener("change", () => {
    sizeFilter = sizeSelect.value;
    filterPets();
    selectBtn.firstElementChild.innerText = "Select"; // Reset the breed selection to "Select"
});

selectBtn.addEventListener("click", () => {
    form.classList.toggle("active");
});

// Fetch breed options and populate the dropdown
function addBreedOptions() {
    options.innerHTML = ""; // Clear previous options
    breedOptions.forEach(breed => {
        const li = `<li onclick="selectBreed(this)">${breed}</li>`;
        options.insertAdjacentHTML("beforeend", li);
    });
}
fetch('/breed-options')
    .then(response => response.json())
    .then(data => {
        breedOptions = data.breed;
        addBreedOptions(); // Populate the dropdown
    })
    .catch(error => {
        console.error('Error fetching breed options:', error);
    });
addBreedOptions();

function selectBreed(selectedLi) {
    searchInp.value ="";
    addBreedOptions(selectedLi.innerText);
    form.classList.remove("active");
    selectBtn.firstElementChild.innerText = selectedLi.innerText;

    // After selecting a breed, filter the pet cards
    const selectedBreed = selectedLi.innerText;
    filterPets(selectedBreed);
}

searchInp.addEventListener("keyup", () => {
    let arr = [];
    let searchedVal = searchInp.value.toLowerCase();
    arr = breedOptions.filter(data => {
        return data.toLowerCase().startsWith(searchedVal);
    }).map(data => `<li onclick="selectBreed(this)">${data}</li>`).join("");
    options.innerHTML = arr ? arr : `<p>Oops! Breed not found</p>`;
});

// Initial filtering when the page loads
filterPets('');
//---------------------