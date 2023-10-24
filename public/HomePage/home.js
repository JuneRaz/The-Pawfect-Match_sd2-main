const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar__menu')

menu.addEventListener('click', function(){
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

const logoutBtn= document.querySelector(".logout-btn")
logoutBtn.addEventListener("click",()=>{
    window.location.replace("http://localhost:7000/homepage/")
})

