var database;

var request = indexedDB.open("listoa");


request.onerror = function(event)  {
    alert('Error!')
    // Do something with request.errorCode!
}; 

request.onsuccess = function(event)  { 
    database = event.target.result;
    return database
} 

request.onupgradeneeded  = function(event) {
    database = event.target.result;
    // Let's create the object store for books
    
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






