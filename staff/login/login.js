
// Event Listener for Login Button
document.getElementById('btnLogin').addEventListener('click', function(){
    var id = parseInt(document.getElementById("txtStaffID").value);
    var password = document.getElementById("txtPassword").value;

    // Check password and username contains a value
    if (id == 'NaN' || password == '') {
        alert('Please enter a User ID and Password')
        return;
    }

    // Get staff member from database
    var transaction = database.transaction(["staff"], 'readwrite');
    var objectStore = transaction.objectStore(["staff"]);
    var request = objectStore.get(id);

    request.onsuccess = () => {
        var record = request.result;

        // Check if Password is incorrect 
        if (password != record['password']){
            alert('Password or User ID is incorrect')
        }

        // Set session variable
        sessionStorage.setItem('id', record['id']);

        // Notify User and Redirect 
        SimpleNotification.success({
            text: 'You are successfully logged in!'
        }, {
            events: {
                onDeath: () => {
                    window.location.href = "../home/home.html";
                },
                onClose: () => {
                    window.location.href = "../home/home.html";
                }
            },
        })
    }
})

function signup(){

    var id =  prompt('Enter a staff ID');
    var firstName = prompt('Enter first name');
    var surname = prompt('Enter surname');
    var password = prompt('Enter password');

    id = parseInt(id)
    var staff = {
        "id": id,
        "forename": firstName,
        "surname": surname,
        "password": password
    }

    var transaction = database.transaction(["staff"], 'readwrite');
    transaction.objectStore("staff").add(staff);

}