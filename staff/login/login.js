document.getElementById('btnLogin').addEventListener('click', function(){
    var id = parseInt(document.getElementById("txtStaffID").value);
    var password = document.getElementById("txtPassword").value;


    var transaction = database.transaction(["staff"], 'readwrite');

    //transaction.onerror = indexedDBError;
    var objectStore = transaction.objectStore(["staff"]);
    var request = objectStore.get(id);
    request.onsuccess = () => {
        var record = request.result;
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
    request.onerror = () => {
        console.log(request.error)
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