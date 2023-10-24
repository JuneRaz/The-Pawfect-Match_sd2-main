// cardZoom.js
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('click', function () {
            // Toggle the zoomed class on click
            card.classList.toggle('zoomed');
        });
    });
});
