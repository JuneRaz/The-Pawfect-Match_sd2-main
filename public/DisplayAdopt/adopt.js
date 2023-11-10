// Fetch the pet data and display cards
fetch('/display', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        const petCardContainer = document.getElementById('petCardContainer');
        const openedPopups = [];

        function createPopup(pet) {
            openedPopups.forEach(popup => {
                if (popup && !popup.closed) {
                    popup.close();
                }
            });
            openedPopups.length = 0;

            const w = 600; // Width of the window
            const h = 600;
            const left = (screen.width - w) / 2;
            const top = (screen.height - h) / 2;
            const popup = window.open('', '_blank', `width=${w},height=${h},left=${left},top=${top}`);

            if (popup) {
                popup.document.open();
                popup.document.write(`
                    <html>
                    <head>
                        <title>${pet.petname}</title>
                        <style>
                            body { font-family: Arial, sans-serif; }
                            h2 { margin-bottom: 10px; }
                            img { max-width: 100%; height: auto; }
                        </style>
                    </head>
                    <body>
                        <span onclick="window.close()" style="cursor: pointer; position: absolute; top: 10px; right: 10px; font-size: 20px;">&times;</span>
                        <h2>${pet.petname}</h2>
                        ${pet.petpic ? `<img src="data:image/png;base64, ${pet.petpic.toString('base64')}" alt="${pet.petname}">` : ''}
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
                    </div>
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
                    });
                }
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
                ${pet.petpic ? `<img src="data:image/png;base64, ${pet.petpic.toString('base64')}" alt="${pet.petname}">` : ''}
            `;

            card.addEventListener('click', () => {
                createPopup(pet);
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
