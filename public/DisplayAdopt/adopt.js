 
 
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
 
 // Fetch the pet data and display cards
 fetch(`/display?${query}`, { method: 'POST' })
 .then(response => response.json())
 .then(data => {
     const petCardContainer = document.getElementById('petCardContainer');
     petCardContainer.innerHTML = ''; // Clear the previous display
     const openedPopups = [];

     function openCustomPopup(url, w, h, left, top, pet) {
         const features = `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes,status=no,menubar=no,toolbar=no`;
         const popup = window.open(url, '_blank', features);

         if (popup) {
             popup.document.open();
             popup.document.write(`
                 <html>
                     <head>
                         <title>${pet.petname}</title>
                         <style>
                             /* Add your custom styles here */
                             body {
                                 font-family: 'Arial', sans-serif;
                                 box-sizing: border-box;
                                 border: 3px solid #8B0000;
                                 color: #853834;
                                 background-color: #f0f0f0;
                                 margin: 80px;
                                 padding: 30px;
                                 text-align: center;
                                 box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5);
                                 vertical-align: top;
                                 border-radius: 10px;
                             }
                             h2 {
                                 font-family: 'Lato:300,400,700';
                                 font-size: 2.5rem;
                                 margin-bottom: 10px;
                                 color: #8B0000;
                             }
                             p {
                                 color: #853834;
                                 font-family: 'Lora';
                                 font-size: 16px;
                                 letter-spacing: 1px;
                                 margin-bottom: 15px;
                             }
                             button {
                                 padding: 10px 20px;
                                 font-size: 16px;
                                 background-color: #4285f4;
                                 color: #ffffff;
                                 border: none;
                                 cursor: pointer;
                             }
                         </style>
                     </head>
                     <body>
                         <span onclick="window.close()" style="cursor: pointer; position: absolute; top: 10px; right: 10px; font-size: 20px;">&times;</span>
                         ${pet.petpic ? `<img src="data:image/png;base64, ${pet.petpic.toString('base64')}" alt="${pet.petname}" style="width: 300px; height: 200px;">` : ''}
                         <h2>${pet.petname}</h2>
                         <p><strong>Date:</strong> ${pet.date}</p>
                         <p><strong>Date:</strong> ${pet.date}</p>
                         <p><strong>Species:</strong> ${pet.species}</p>
                         <p><strong>Breed:</strong> ${pet.breed}</p>
                         <p><strong>Gender:</strong> ${pet.gender}</p>
                         <p><strong>Size:</strong> ${pet.size}</p>
                         <h2>Owner Info</h2>
                         <p><strong>Name:</strong> ${pet.name}</p>
                         <p><strong>Age:</strong> ${pet.age}</p>
                         <p><strong>Address:</strong> ${pet.address}</p>
                         <p><strong>Email:</strong> ${pet.email}</p>
                         <p><strong>No.:</strong> ${pet.mno}</p>
                         <div style="text-align: center;">
                             <div style="display: inline-block;">
                                 <button id="Fave-button" class="custom-button" style="padding: 10px 20px; border: 2px solid #4CAF50; border-radius: 5px; background-color: #4CAF50; color: white; font-size: 16px; margin: 5px; cursor: pointer; transition: all 0.3s;">Favorite</button>
                             </div>

                             <div style="display: inline-block;">
                                 <button id="Adopt-button" class="custom-button" style="padding: 10px 20px; border: 2px solid #4CAF50; border-radius: 5px; background-color: #4CAF50; color: white; font-size: 16px; margin: 5px; cursor: pointer; transition: all 0.3s;">Adopt</button>
                             </div>
                            <br>
                             <div style="display: inline-block;">
                            
                                 <button id="Delete-button" class="deletebtn" onclick="confirmDelete()" style="padding: 10px 20px; border: 2px solid #4CAF50; border-radius: 5px; background-color: #4CAF50; color: white; font-size: 16px; margin: 5px; cursor: pointer; transition: all 0.3s;">Delete</button>
                                   
                                 </div>

                         </div>
                         
                                <script>
                                function confirmDelete() {
                                    var confirmation = confirm("Are you sure you want to delete?");
                                    if (confirmation) {
                                        // If the user clicks OK, execute the deletion logic here
                                        // For example, you can call a function that handles the deletion
                                      
                                        window.location.href = '/delete-pet?id=${pet.id}';
                                        
                                        
                                    } else {
                                        // If the user clicks Cancel, do nothing or provide feedback
                                        alert("Deletion canceled.");
                                        window.close();
                                    }
                                }

                                function deleteItem() {
                                    console.log("Item deleted!");
                                  
                                    
                                }
                                </script>
                                                        
                     </body>
                 </html>
             `);

             popup.document.close(); 
             
             



             // Add event listener to the Adopt button inside the popup
             const adoptButton = popup.document.getElementById('Adopt-button');
             if (adoptButton) {
                 adoptButton.addEventListener('click', () => {
                     popup.close();
                     window.location.href = 'http://localhost:7000/adoptionForm/';
                     // Pass the selected pet information to the adoption form
                     window.localStorage.setItem('selectedPet', JSON.stringify(pet));
                 });
             }

             openedPopups.push(popup);
         } else {
             alert('Please allow pop-ups for this site to view the details.');
         }
     }

     function createCard(pet) {
         const card = document.createElement('div');
         card.classList.add('card');

         card.innerHTML = `
             <h2>${pet.petname}</h2>
             <p><strong>Date:</strong> ${pet.date}</p>
             <p><strong>Species:</strong> ${pet.species}</p>
             <p><strong>Breed:</strong> ${pet.breed}</p>
             <p><strong>Gender:</strong> ${pet.gender}</p>
             <p><strong>Size:</strong> ${pet.size}</p>
             <h2>Owner Info</h2>
             <p><strong>Name:</strong> ${pet.name}</p>
             <p><strong>Age:</strong> ${pet.age}</p>
             <p><strong>Address:</strong> ${pet.address}</p>
             <p><strong>Email:</strong> ${pet.email}</p>
             <p><strong>No.:</strong> ${pet.mno}</p>
             ${pet.petpic ? `<img src="data:image/png;base64, ${pet.petpic.toString('base64')}" alt="${pet.petname}">` : ''}`;

         card.addEventListener('click', () => {
             openCustomPopup('', 600, 600, (screen.width - 600) / 2, (screen.height - 600) / 2, pet);
         });

         petCardContainer.appendChild(card);
     }

     data.pets.forEach(pet => {
         createCard(pet);
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