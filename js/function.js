var map = L.map('map', {
  center: [39.9522, -75.1639],
  zoom: 12
});
var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

//Variables storing zip code interval, convenient to change accordingly
var zipCodeMin = 19140;
var zipCodeMax = 19149;

//Get the name of health center attributes
var getKeys = function(array){
  var keys = [];
  for(var i = 0; i < Object.keys(array[0]).length; i++){
    keys.push(Object.keys(array[0])[i]);
  }
  return keys;
};

//Get the values of health center attributes
var eachCenter = function(object){
  var center = [];
  for (var i in object){
    center.push(object[i]);
  }
  return center;
};

//Determine if the given zip code is within the required area
var withinZipCode = function (value){
  if(value >= zipCodeMin && zipCodeMax <= 19149){
    return true;
  }
  else{
    return false;
  }
};

var isDental = function (string){
  if (string !== "N/A"){
    return true;
  }
  else{
    return false;
  }
}

//Convert .json data to .csv format
var jsonToCsv = function(json) {
  var healthCentersCsv = [];
  //Add the head of the health center
  healthCentersCsv.push(getKeys(json));
  //Add the values of all health centers
  for(var i = 0; i < json.length; i++){
    healthCentersCsv.push(eachCenter(json[i]));
  }
  //Log the arrays to the console
  return healthCentersCsv;
};

//Filter CSV data, outcomes are within zip code interval
var filterCsv = function (data){
    var filtered = [];
    filtered.push(data[0]);
    for (var i = 0; i < data.length; i++){
      if(withinZipCode(data[i][5])){
        filtered.push(data[i]);
      }
      else{}
    }
    return filtered;
}

/*Log a series of arrays to the console that represents the health_centers
  dataset in CSV form.*/
var logCsv = function (array){
  console.log(array);
}

//Add markers of health centers within the required zip codes
var addMarkers = function(map, data) {
  //Create marker options
  var dentalIcon = L.icon({
      'iconUrl': 'js/images/dental_icon.png',
      'iconSize': [30,30]
    });
  var markerOption1 = {
    'icon': dentalIcon,
    'draggable': true
  };
  var markerOption2 = {
    'draggable': true
  }
  //Add markers and popups to the map
  var popUp;
  var marker;
  for(var i = 0; i < data.length; i++){
    if(typeof(data[i][0]) === 'number'){
      popUp = "<b>"+ data[i][3]+"</b>";
      if(isDental(data[i][8])){
        marker = L.marker([data[i][1], data[i][0]],markerOption1).addTo(map);
        marker.bindPopup(popUp).openPopup();
      }
      else{
        marker = L.marker([data[i][1], data[i][0]],markerOption2).addTo(map);
        marker.bindPopup(popUp).openPopup();
      }
    }
  }
};

//log all health centers
logCsv(jsonToCsv(healthCenters));
//log health centers within the required zip code interval
logCsv(filterCsv(jsonToCsv(healthCenters)));
//Add markers and popups to the map
addMarkers(map,filterCsv(jsonToCsv(healthCenters)));
