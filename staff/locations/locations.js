window.addEventListener('load', () => {
    initAutoComplete();
    initMap();
})

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


function initAutoComplete() {

    let txtAutoComplete = document.getElementById("txtLocationAddress")

    let autoComplete = new window.google.maps.places.Autocomplete(txtAutoComplete);

    autoComplete.setComponentRestrictions({ "country": "uk" });

    autoComplete.addListener("place_changed", () => 
    { 
        var place = autoComplete.getPlace();
        document.getElementById('lblLocationLat').innerHTML = place.geometry.location.lat();
        document.getElementById('lblLocationLng').innerHTML = place.geometry.location.lng();
    })

}


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
			
    // transaction.onerror = indexedDBError;
    objectStore = transaction.objectStore('locations');
    request = objectStore.getAll();

    // request.onerror = indexedDBError;
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
                    infowindow.setContent(locations[i].name)
                    infowindow.open(map, marker);
                }

            })(marker, i));


        }
    }
}
