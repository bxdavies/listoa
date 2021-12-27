
// Global Variable Database accessed in other files 
var database;

// Event Listener for Load
window.addEventListener('load', () => {

    // Delay the execution of the functions so DOM can load fully
    setTimeout(() => {
        checkIndexDBSupport();
    }, 500)
})

// Check if the browser supports indexedDB
function checkIndexDBSupport(){
    if(window.chrome){

    } else {
        alert("Please use a chromium based web browser as in my testing IndexedDB does not work correctly on other non chromium browsers")
        window.location.replace('http://www.google.com')
    }
    if (indexedDB) {

    } else {
        alert("Your browser doesn't support a stable version of IndexedDB. This website will not work without it.");
        window.location.replace('http://www.google.com')
    }
    initDatabase();

}

function initDatabase(){
    var request = indexedDB.open("listoa");

    // Request Error
    request.onerror = function(event)  {
        alert('DB Error!')
    }; 

    // Request Success
    request.onsuccess = function(event)  { 
        database = event.target.result;
        return database
    } 

    // Database Upgrade Needed
    request.onupgradeneeded  = function(event) {
        database = event.target.result;
        
        database.createObjectStore("staff",  { 
            keyPath:"id"  });
        database.createObjectStore("categories", {
            keyPath:"name"
        })
        database.createObjectStore("products",{
            keyPath:"name"
        })
        database.createObjectStore("locations", {
            keyPath:"name"
        })
        return database
    }
}