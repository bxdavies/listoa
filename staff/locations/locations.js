
// Event Listener for Load
window.addEventListener('load', () => {
    setTimeout(() => { 
        initAutoComplete();
        initMap();
    }, 1000);
})

// Event Listener for for Add Location Button
document.getElementById('btnAddLocation').addEventListener('click', () => 
{   
    // Get values from Fields
    var locationName = document.getElementById('txtLocationName').value;
    var locationAddress = document.getElementById('txtLocationAddress').value;
    var locationLat = document.getElementById('lblLocationLat').innerHTML;
    var locationLng = document.getElementById('lblLocationLng').innerHTML;

    // Create an address object
    var location ={
        "name": locationName,
        "address": locationAddress,
        "lat": locationLat,
        "lng": locationLng
    }

    // Add the address object to the database
    var transaction = database.transaction(["locations"], 'readwrite');
    transaction.objectStore("locations").add(location);

    // Empty Fields
    document.getElementById('txtLocationName').value = ''
    document.getElementById('txtLocationAddress').value = ''
    document.getElementById('lblLocationLat').innerHTML = ''
    document.getElementById('lblLocationLng').innerHTML = ''

    // Refresh the Map
    initMap();
})

// Initialize Auto Complete
function initAutoComplete() {

    // Get Address Text Box
    let txtAutoComplete = document.getElementById("txtLocationAddress")

    // Create an Google Maps Autocomplete on the Text Box
    let autoComplete = new window.google.maps.places.Autocomplete(txtAutoComplete);

    // Set component restrictions to UK only
    autoComplete.setComponentRestrictions({ "country": "uk" });

    // Create Autocomplete Listener to Update Lat and Long Fields
    autoComplete.addListener("place_changed", () => 
    { 
        var place = autoComplete.getPlace();
        document.getElementById('lblLocationLat').innerHTML = place.geometry.location.lat();
        document.getElementById('lblLocationLng').innerHTML = place.geometry.location.lng();
    })

}

// Initialize the Map
function initMap()
{   
    
    // Create Map
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: new google.maps.LatLng(51.89934719994831, -2.078342627096383),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Fetch all locations from the database and add them to the map
    var transaction = database.transaction('locations', 'readonly'), objectStore, request, results = [];
    objectStore = transaction.objectStore('locations');
    request = objectStore.getAll();

    // Request Success
    request.onsuccess = function(event) {
        var locations = event.target.result
        var infowindow = new google.maps.InfoWindow();
        var marker;

        // Loop through each location in the database
        for (i in locations) 
        {
            
            // Create a marker for the location
            marker = new google.maps.Marker(
                {
                    position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
                    map: map
                }
            );

            // Create an event handler for the the location marker
            google.maps.event.addListener(marker, 'click', (function (marker, i)
            {
                return function () 
                {
                    // Create content DIV
                    var content = document.createElement('div');

                    // Create Paragraph and Link
                    var pName = document.createElement('p');
                    var btnDelete =document.createElement('button')

                    // Set the name
                    pName.innerHTML = locations[i].name

                    // Set parameters of the link
                    btnDelete.innerHTML = 'Delete Location'
                    btnDelete.value = locations[i].name

                    // Create an event listener on the link
                    btnDelete.addEventListener('click', (event) => {

                        // Delete Location from the database
                        var transaction = database.transaction('locations', 'readwrite'), objectStore;
                        objectStore = transaction.objectStore('locations');
                        objectStore.delete(event.target.value)

                        // Alert User and Reload the Page
                        alert('Location Deleted!')
                        window.location.reload();
                    })
                    
                    // Add Paragraph and Link to Content Div
                    content.append(pName)
                    content.append(btnDelete)

                    infowindow.setContent(content);
                    infowindow.open(map, marker);
                }

            })(marker, i));


        }
    }
}
