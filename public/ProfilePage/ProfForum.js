fetch('/display-Forum', { method: 'POST' })
.then(response => response.json())
.then(data => {
    const postContainer = document.getElementById('Post-container');
    function formatDate(dateString) {
       const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
       return new Date(dateString).toLocaleDateString('en-US', options);
   }
    const openedPopups = []

    function openCustomPopup(url, w, h, left, top, appdata) {
        const features = `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes,status=no,menubar=no,toolbar=no`;
        const popup = window.open(url, '_blank', features);

        if (!popup || popup.closed || typeof popup.closed=='undefined') {
            alert('Please disable your popup blocker to view this content.');
            return;
        }

        try {
            popup.document.open();
            popup.document.write(`
                <html>
                    <head>
                        <title>${appdata.user}</title>
                    </head>
                    <body>
                        <!-- Your popup content here -->
                    </body>
                </html>
            `);
            popup.document.close();
            openedPopups.push(popup);
        } catch (error) {
            console.error('Error opening popup:', error);
        }
    }

    function createCard(appdata) {
        const card = document.createElement('div');
        card.classList.add('card');
        const formattedDate = formatDate(appdata.date);

        card.innerHTML = `
        <div class="post-container">
                <div class="post-row"> 
                    <div class="user-profile">
                    <img src="data:image/png;base64,${appdata.profpic}" id="img">
                        <div>
                            <p>${appdata.fname}</p>
                            <span id="PostedDate">${formattedDate}</span>
                        </div>
                    </div>
                    <a href="#"><i class="fa-solid fa-ellipsis"></i></a>
                </div>
                <p class="post-text">${appdata.post}</p>

                <hr>
                <div class="reacts-row">
                    <div class="activity-icon">
                        <div><img src="images/like-blue.png">20</div>
                    </div>    
                    <div class="activity-comments-icon" onclick="commentsMenuToggle()">
                        <div class="Comment-counter"><img src="images/comments.png"> </div>
                    </div>
                </div>
                <hr>`;
            
        card.addEventListener('click', () => {
            openCustomPopup('about:blank', 600, 600, (screen.width - 600) / 2, (screen.height - 600) / 2, appdata);
        });

        postContainer.appendChild(card);
    }

    data.appdata.forEach(appdata => {
        createCard(appdata);
    });
})
.catch(error => {
    console.error('Error fetching data:', error);
});
