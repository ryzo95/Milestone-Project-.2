// Function to initialize the map
function initMap() {
    // Default map center - New York City coordinates for example.
    const mapCenter = { lat: 40.7128, lng: -74.0060 };

    // Map instance
    const map = new google.maps.Map(document.getElementById('map'), {
        center: mapCenter,
        zoom: 12,
    });

    // Search box linked to UI element
    const input = document.getElementById('searchInput');
    const searchBox = new google.maps.places.SearchBox(input);

    // Searcg results biased towards map current viewport
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    // Listen for user precitions from the list
    searchBox.addListener('places_changed', function () {
        const places = searchBox.getPlaces();

        if (places.length === 0) {
            return;
        }

        // Clear exisiting markers
        const markers = [];
        markers.forEach(function (marker) {
            marker.setMap(null);
        });

        // Map markers
        const bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log('Returned place contains no geometry');
                return;
            }

            const icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25),
            };

            // Place markers
            const marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location,
            });

            markers.push(marker);

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });

        // Fitting to the bounds of map markers
        map.fitBounds(bounds);
    });
}