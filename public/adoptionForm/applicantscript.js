





const appemail = JSON.parse(window.localStorage.getItem('appemail'));
console.log('appemail:', appemail);

fetch(`/applicantForm/:appname/${appemail}/:token`, { method: 'POST' })
  .then(response => response.json())
  .then(data => {
    const appdata = data.appdata;
    const appDataContainer = document.getElementById('appDataContainer');

    if (appdata.length > 0) {
      // Create a card container
      const cardContainer = document.createElement('div');
      cardContainer.classList.add('card-container');


      const frontSide = document.createElement('div');
      frontSide.classList.add('card', 'front');
      
      const imageElement = document.createElement('img');
      imageElement.src = `data:image/jpeg;base64,${appdata[0].appic}`;
      imageElement.alt = 'Applicant Picture';
      frontSide.appendChild(imageElement);

      const header = document.createElement('h2');
      header.textContent = 'Applicant Information';
      frontSide.appendChild(header);


      // Create HTML elements to display data
      
      const nameParagraph = document.createElement('p');
      nameParagraph.innerHTML = `<br>Name: ${appdata[0].appname}`;
      frontSide.appendChild(nameParagraph);

      const ageParagraph = document.createElement('p');
      ageParagraph.innerHTML= `<br>Age: ${appdata[0].age1}`;
      frontSide.appendChild(ageParagraph);

      const genderParagraph = document.createElement('p');
      genderParagraph.innerHTML= `<br>Gender: ${appdata[0].gender1}`;
      frontSide.appendChild(genderParagraph);

      const addressParagraph = document.createElement('p');
      addressParagraph.innerHTML = `<br>Address: ${appdata[0].address1}`;
      frontSide.appendChild(addressParagraph);

      const appemailParagraph = document.createElement('p');
      appemailParagraph.innerHTML = `<br>Email: ${appemail}`;
      frontSide.appendChild(appemailParagraph);

      const mobileParagraph = document.createElement('p');
      mobileParagraph.innerHTML= `<br>Mobile Number: ${appdata[0].mno1}`;
      frontSide.appendChild(mobileParagraph);


      cardContainer.appendChild(frontSide);
      //response

      const backSide = document.createElement('div');
      backSide.classList.add('card', 'back');

      const header2 = document.createElement('h2');
      header2.textContent = 'Response to the Question';
      backSide.appendChild(header2);


      const responseParagraph=document.createElement('p');
      responseParagraph.innerHTML = `<br>Are all the members of your household in agreement with this adoption?: <br> <span style ="color: red";> ${appdata[0].response1}</span>`;
      backSide.appendChild(responseParagraph);

      const careParagraph = document.createElement('p');
      careParagraph.innerHTML= `<br>Who will be the pet's primary caregiver?: <br> <span style ="color: red";>${appdata[0].care}</span>`;
      backSide.appendChild(careParagraph);

      const liveParagraph = document.createElement('p');
      liveParagraph.innerHTML = `<br>what type of house do you live in ?:<br> <span style ="color: red";> ${appdata[0].live}</span>`;
      backSide.appendChild(liveParagraph);

      const response2Paragraph=document.createElement('p');
      response2Paragraph.innerHTML = `<br>Have you adopted from an animal welfare group before?: <br> <span style ="color: red";>${appdata[0].response2}</span>`;
      backSide.appendChild(response2Paragraph);

      const response3Paragraph=document.createElement('p');
      response3Paragraph.innerHTML = `<br>Have you ever given up a pet?: <br> <span style ="color: red";>${appdata[0].response3}</span>`;
      backSide.appendChild(response3Paragraph);

      const reasonParagraph = document.createElement('p');
      reasonParagraph.innerHTML = `<br>Reason: <br><span style="color: red;">${appdata[0].reason}</span>`;
      backSide.appendChild(reasonParagraph);
      
      cardContainer.appendChild(backSide);

   

      // Append the card container to the main container
      appDataContainer.appendChild(cardContainer);
    } else {
      const noDataParagraph = document.createElement('p');
      noDataParagraph.textContent = 'No data found for the given email.';
      appDataContainer.appendChild(noDataParagraph);
    }
  })
  .catch(error => {
    console.error('Error fetching data:', error);
});
