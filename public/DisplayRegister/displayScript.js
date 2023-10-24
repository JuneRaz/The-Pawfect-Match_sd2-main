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

const form = document.querySelector(".form");
selectBtn = form.querySelector(".select-btn"),
searchInp = form.querySelector("input"),
options = form.querySelector(".options");


let breedOptions = [];

function addBreedOptions() {
    options.innerHTML = ""; // Clear previous options
    breedOptions.forEach(breed => {
        const li = `<li onclick="updateName(this)">${breed}</li>`;
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

function updateName(selectedLi) {
    searchInp.value ="";
    addPet(selectedLi.innerText);
    form.classList.remove("active");
    selectBtn.firstElementChild.innerText = selectedLi.innerText;
}

searchInp.addEventListener("keyup", () => {
    let arr = []; //creating empty arry
    let searchedVal = searchInp.value.toLowerCase();
    // returning all species
    // and mapping returned pet with li and joining them
    arr = breedOptions.filter(data => {
        return data.toLocaleLowerCase().startsWith(searchedVal);
    }).map(data => `<li onclick="updateName(this)">${data}</li>`).join("");
    options.innerHTML = arr ? arr : `<p>Oops! Breed not found</p>`;
});

selectBtn.addEventListener("click", () => {
    form.classList.toggle("active");
});