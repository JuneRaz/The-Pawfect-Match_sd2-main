fetch('/discussion', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        const postCardContainer = document.getElementById('post-container');

        function formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-US', options);
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
                    <p class="post-text">${appdata.post}<span></p>

                    <div class="reacts-row">
                    <div class="activity-icon">
                        <div><img src="images/like-blue.png"> 994</div>
                    </div>    
                    
                    <div class="activity-comments-icon">
                        <div><img src="images/comments.png"> 845</div>
                    </div>
                </div>

                <form id="publishComment" action="/publishComment" method="POST" enctype="multipart/form-data">
                <input type="hidden" name="postId" value="${appdata.id}">                    
                    <div class="comments-menu">
                    <div class="comments-menu-inner">
                        <div class="comments-profile">
                            <img src="images/profile-pic.webp">
                            <textarea placeholder="Comment" id = "pubcomment" name = "pubcomment"required></textarea>
                        </div>
                        <div class="add-comments-link">
                            <button class="comments" name="comment" id ="comment">Comment</button>
                            <button type ="button" class="cancel" name ="cancel" id = "cancel">Cancel</button>
                        </div>
                    </div>
                    </div>
                </form>
        
       
                  `;
                    
        
                  const commentsMenu = card.querySelector(".comments-menu");
                  const cancelBtn = card.querySelector(".cancel");

                  // Find the comments icon in the newly created card
                  const commentsIcon = card.querySelector(".activity-comments-icon");
          
                  // Add event listener to the comments icon for toggling the comments menu
                  commentsIcon.addEventListener("click", function() {
                      commentsMenu.classList.toggle("comments-menu-height");
                  });
                  cancelBtn.addEventListener("click", function() {
                    commentsMenu.classList.remove("comments-menu-height");
                });

                const commentButton = card.querySelector("#comment"); 
                if (commentButton) {
                    commentButton.addEventListener('click', () => {
                        const publishCommentForm = card.querySelector("#publishComment");
                        if (publishCommentForm) {
                            publishCommentForm.submit();
                        }
                    });
                }
                



          


            // Inserting new card at the beginning of the container
            if (postCardContainer.firstChild) {
                postCardContainer.insertBefore(card, postCardContainer.firstChild);
            } else {
                postCardContainer.appendChild(card);
            }
        }

        data.appdata.forEach(appdata => {
            createCard(appdata);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

