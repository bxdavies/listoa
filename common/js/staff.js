window.addEventListener('load', () => {
    var staffID = sessionStorage.getItem('id');

    if (staffID == undefined) {
        alert('Your are not logged in as a staff member!\nIf you are a staff member, please login again!');
        window.location.href = "../../index.html";
    }
})
