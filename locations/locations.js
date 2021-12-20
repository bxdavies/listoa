window.addEventListener('load', () => {
    setTimeout(() => {
        initMap();
    }, 1000)
})

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
