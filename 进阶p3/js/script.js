//initail the places:) well I just add 7 places
var model = {
    "places": [{
    		"id": 0,
            "name": "government",
            "location": {
                "lat": 39.085328,
                "lng": 117.198823
            },
            "attribute": "public service"
        },
        {
        	"id": 1,
            "name": "Tianjin university",
            "location": {
                "lat": 39.10893668029149,
                "lng": 117.1782560802915
            },
            "attribute": "school"
        },
        {
        	"id": 2,
            "name": "Nankai university",
            "location": {
                "lat": 39.1077739802915,
                "lng": 117.1768419802915
            },
            "attribute": "school"
        },
        {
        	"id": 3,
            "name": "General Hospital of Tianjin Medical University",
            "location": {
                "lat": 39.118484,
                "lng": 117.185401
            },
            "attribute": "public service"
        },
        {
        	"id": 4,
            "name": "dayuecheng",
            "location": {
                "lat": 39.134511,
                "lng": 117.179448
            },
            "attribute": "shopping"
        },
        {
        	"id": 5,
            "name": "eye of Tianjin",
            "location": {
                "lat": 39.15411298029149,
                "lng": 117.1905999802915
            },
            "attribute": "amusement"
        },
        {
        	"id": 6,
            "name": "Ancient Culture Street",
            "location": {
                "lat": 39.1437189,
                "lng": 117.192773
            },
            "attribute": "amusement"
        }
    ]
};

//global infowindow
var globalInfo;

//alert when map can't be loaded
function mapError() {
    alert("maybe your map can't be loaded, please check your Internet");
}

//processing the maps and initial the wikipedia links and baidu links
var map;
var markers = [];
var wikiUrls = [];
var baiduUrls = [];
for (var j = 0; j < model.places.length; j++) {
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + model.places[j].name + '&format=json&callback=wikiCallback';
    var baiduUrl = 'http://api.map.baidu.com/geocoder/v2/?output=json&ak=hGUjdzcK1dHcyxaQlQDN64kLxQTEP3gG&location=' + model.places[j].location.lat + ',' + model.places[j].location.lng;
    wikiUrls.push(wikiUrl);
    baiduUrls.push(baiduUrl);
}

//as the function name means
function toggleBounce(obj) {
    var self = obj;
    {
        self.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            self.setAnimation(null);
        }, 1400);
    }
}

function showWiki(i) {
    $.ajax({
        url: wikiUrls[i],
        dataType: "jsonp",

        success: function(response) {
            var articleList = response[1];
            $(".information").append('<h2>wikipedia links</h2>');
            model.det = articleList;
            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $(".information").append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            }
        },
        //process the error codes
        error: function() {
            $(".information").append('<h1>Maybe the console occurred some errors...</h1>');
        }
    });
}

function showDetail(i) {
    $.ajax({
        url: baiduUrls[i],
        dataType: "jsonp",

        success: function(response) {
            var locationList = response.result.addressComponent;
            var domm = $(".information");
            domm.append('<h2>details about this place</h2>');
            domm.append('<p>' + locationList.country + locationList.province + locationList.district + locationList.adcode + locationList.street + locationList.street_number + '</p>');
            domm.append('<br>');
            domm.append('<p>' + response.result.sematic_description + '</p>');
        },
        //processing the error codes
        error: function() {
            $(".information").append('<h1>Maybe the console occurred some errors...</h1>');
        }
    });
}

function createInfo(obj, index) {
    if(globalInfo) {
    	globalInfo.close();
    }
    var infoWindow = new google.maps.InfoWindow({
        content: obj.title
    });
    infoWindow.open(map, obj);
    globalInfo = infoWindow;
    moveMarker(index);
}

//called when the places list clicked, clear all content before layout new things
function moveMarker(i) {
    if(globalInfo) {
        globalInfo.close();
    }
    var infoWindow = new google.maps.InfoWindow({
        content: markers[i].title
    });
    infoWindow.open(map, markers[i]);
    globalInfo = infoWindow;

    toggleBounce(markers[i]);
    $(".information").empty();
    showWiki(i);
    showDetail(i);
}

function addMarker(placeData) {
    var marker = new google.maps.Marker({
        position: placeData.location,
        map: map,
        animation: google.maps.Animation.DROP,
        title: placeData.name
    });

    var self = marker;

    marker.addListener('click', function() {toggleBounce(self)});
    marker.addListener('click', function() {createInfo(self, placeData.id)})
    markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

function initMap() {

    //using different style of map by copying the popular style
    var styles = [{
        featureType: 'water',
        stylers: [{
            color: '#19a0d8'
        }]
    }, {
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [{
                color: '#ffffff'
            },
            {
                weight: 6
            }
        ]
    }, {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#e85113'
        }]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
                color: '#efe9e4'
            },
            {
                lightness: -40
            }
        ]
    }, {
        featureType: 'transit.station',
        stylers: [{
                weight: 9
            },
            {
                hue: '#e85113'
            }
        ]
    }, {
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [{
            visibility: 'off'
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{
            lightness: 100
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
            lightness: -100
        }]
    }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
                visibility: 'on'
            },
            {
                color: '#f0e4d3'
            }
        ]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{
                color: '#efe9e4'
            },
            {
                lightness: -25
            }
        ]
    }];

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 39.1188936,
            lng: 117.1796735
        },
        styles: styles,
        mapTypeControl: false,
        zoom: 12
    });

    for(var i = 0; i < model.places.length; i++) {
        addMarker(model.places[i]);
        //$(".places").append('<li class="place-items" onclick="moveMarker(' + i + ')">' + model.places[i].name + '</li>');
    }
}

//using knockout to process the viewmodel
var viewModel = function() {
    var self = this;
    self.place = ko.observable('');
    self.detail = ko.computed(function() {
        var res = model.places.filter(function(lot) {
            return lot.name.toLowerCase().indexOf(self.place().toLowerCase()) >= 0;
        });
        setTimeout(function() {
        	deleteMarkers();
        	var a = document.getElementsByClassName('place-items');
        	for (var i = 0; i < res.length; i++) {
        		addMarker(res[i]);
        	}
        }, 600);
        return res;
    });
};

ko.applyBindings(new viewModel());