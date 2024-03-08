
 // Fetch the pet data and display cards
 fetch('/display-fave', { method: 'POST' })
 .then(response => response.json())
 .then(data => {
     const petCardContainer = document.getElementById('petCardContainer1');
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
                                 <button id="Fave-button" class="custom-button" style="padding: 10px 20px; border: 2px solid #4CAF50; border-radius: 5px; background-color: #4CAF50; color: white; font-size: 16px; margin: 5px; cursor: pointer; transition: all 0.3s;">Update</button>
                             </div>

                             <div style="display: inline-block;">
                                
                             </div>

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
             const adoptButton = popup.document.getElementById('Fave-button');
             if (adoptButton) {
                 adoptButton.addEventListener('click', () => {
                     popup.close();
                     window.location.href = 'http://localhost:7000/Updatesel';
                     // Pass the selected pet information to the adoption form
                     window.localStorage.setItem('selectedPet1', JSON.stringify(pet));
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



