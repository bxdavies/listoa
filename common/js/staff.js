
// Event Listener for Load
window.addEventListener('load', () => {
    
    // Get staff ID from session data
    var staffID = sessionStorage.getItem('id');

    // If staff ID is undefined then user is not allowed to access this page
    if (staffID == undefined) {
        alert('Your are not logged in as a staff member!\nIf you are a staff member, please login again!');
        window.location.href = "../../index.html";
    }
})
