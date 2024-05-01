// Function to fetch comments for a specific post ID
function fetchPostComments(postId) {
    fetch(`/getPostComments/${postId}`)
        .then(response => response.json())
        .then(data => {
            const commentsContainer = document.getElementById('comments-container');
            commentsContainer.innerHTML = ''; // Clear existing comments

            data.comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.innerHTML = `
                    <div class="comment-user">${comment.user}</div>
                    <div class="comment-text">${comment.post}</div>
                    <div class="comment-date">${formatDate(comment.date)}</div>
                `;
                commentsContainer.appendChild(commentElement);
            });
        })
        .catch(error => {
            console.error('Error fetching comments:', error);
        });
}

// Call fetchPostComments function when the page loads or when needed
fetchPostComments(postId); // Replace postId with the actual post ID
