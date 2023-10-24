
function handleCheckboxChange(checkbox) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((cb) => {
        if (cb !== checkbox) {
            cb.checked = false;
        }
    });
}


function doSomething(button) {
    const acceptCheckbox = document.getElementById("accept");
    const declineCheckbox = document.getElementById("decline");
    if(acceptCheckbox.checked){
        window.location.href = "http://localhost:7000/surrender";
    }
    else if(declineCheckbox.checked){
        alert("Please Accept the terms and condition");
    }
    else{
        alert("Please Choose either of the option");
    }
}
