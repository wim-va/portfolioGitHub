'use strict';
var mapA = null;
var mapB = null;

function dataOphalenAntw() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://datasets.antwerpen.be/v4/gis/museumoverzicht.xml")

    xmlHttp.onload = function() {
        if (xmlHttp.status == 200) {
            var xmlDoc = xmlHttp.responseXML;
            var musea = xmlDoc.getElementsByTagName("record");
            vulTabelAntw(musea);
        }
    }
    xmlHttp.send();
}

function vulTabelAntw(musea) {
    var result = "";
    var rijen = [];
    for (var i = 0; i < musea.length; i++) {
        // var stad =
        var naam = musea[i].getElementsByTagName("naam")[0].textContent;
        var straat = musea[i].getElementsByTagName("straat")[0].textContent;
        var huisnummer = musea[i].getElementsByTagName("huisnummer")[0].textContent;
        var breedtegraad = musea[i].getElementsByTagName("point_lat")[0].textContent;
        var lengtegraad = musea[i].getElementsByTagName("point_lng")[0].textContent;
        var adres = straat + " " + huisnummer;
        var rij = {
            naam: naam,
            adres: adres,
            breedtegraad: breedtegraad,
            lengtegraad: lengtegraad
        };
        rijen.push(rij);
        result += "<tr>" +
            "<td>" + "Antwerpen" + "</td>" +
            "<td>" + rijen[i].naam + "</td>" +
            "<td>" + rijen[i].adres + "</td>" +
            // "<td>" + rijen[i].breedtegraad + "</td>" +
            // "<td>" + rijen[i].lengtegraad + "</td>" +
            "</tr>";
        var googleLatAndLong = new google.maps.LatLng(breedtegraad, // object van google
            lengtegraad);
        var content = naam + " " + adres;
        var title = naam;
        addMarkerAntw(mapA, googleLatAndLong, title, content)
    }
    document.getElementById("overzicht_musea").innerHTML += result;
}


function dataOphalenBru() {
    var jsonHttp = new XMLHttpRequest();
    jsonHttp.open("GET", "http://opendata.brussel.be/api/records/1.0/search/?dataset=musea-in-brussel");

    jsonHttp.onload = function() {
        if (jsonHttp.status == 200) {
            var jsonDoc = JSON.parse(jsonHttp.responseText);
            var alleRecords = jsonDoc.records;
            vulTabelBru(alleRecords);
        }
    }
    jsonHttp.send();
}

function vulTabelBru(alleRecords) {
    var result = "";
    var rijen = [];
    for (var i = 0; i < alleRecords.length; i++) {
        var naam = alleRecords[i].fields.naam_van_het_museum;
        var adres = alleRecords[i].fields.adres;
        var breedtegraad = alleRecords[i].fields.latitude_breedtegraad;
        var lengtegraad = alleRecords[i].fields.longitude_lengtegraad;
        var rij = {
            naam: naam,
            adres: adres,
            breedtegraad: breedtegraad,
            lengtegraad: lengtegraad
        };
        rijen.push(rij);
        result += "<tr>" +
            "<td>" + "Brussel" + "</td>" +
            "<td>" + rijen[i].naam + "</td>" +
            "<td>" + rijen[i].adres + "</td>" +
            // "<td>" + rijen[i].breedtegraad + "</td>" +
            // "<td>" + rijen[i].lengtegraad + "</td>" +
            "</tr>";
        var googleLatAndLong = new google.maps.LatLng(breedtegraad, // object van google
            lengtegraad);
        var content = naam + " " + adres;
        var title = naam;
        addMarkerBru(mapB, googleLatAndLong, title, content)
    }
    document.getElementById("overzicht_musea").innerHTML += result;
}


function toonMapBru(long, lat) {
    var googleLatAndLong = new google.maps.LatLng(long, // object van google
        lat);
    var mapOptions = { // object met opties zoals zoom, center = middelpunt van de kaart
        zoom: 12,
        center: googleLatAndLong,
        mapTypeId: google.maps.MapTypeId.ROADMAP // mapTypeId = ROADMAP is type voor wegenkaart
    };
    var mapDiv = document.getElementById("map_bru");
    mapB = new google.maps.Map(mapDiv, mapOptions); // waar tonen en met welke opties
}

function toonMapAntw(long, lat) {
    var googleLatAndLong = new google.maps.LatLng(long, // object van google
        lat);
    var mapOptions = { // object met opties zoals zoom, center = middelpunt van de kaart
        zoom: 12,
        center: googleLatAndLong,
        mapTypeId: google.maps.MapTypeId.ROADMAP // mapTypeId = ROADMAP is type voor wegenkaart
    };
    var mapDiv = document.getElementById("map_antw");
    mapA = new google.maps.Map(mapDiv, mapOptions); // waar tonen en met welke opties

}

function addMarkerBru(map, latlong, title, content) {

    var markerOptions = {
        position: latlong,
        map: map, // in welke map tonen?
        title: title,
        clickable: true // er mag op geklikt worden en er moet dan iets gebeuren
    };
    var marker = new google.maps.Marker(markerOptions);

    var infoWindowOptions = { // hoe moet infowindow er uit zien, eerst opties bepalen
        content: content,
        position: latlong
    };

    var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

    google.maps.event.addListener(marker, 'click', function() { // welke marker moet iets doen, als we er op klikken, welke functie uitvoer
        infoWindow.open(map);
    });
}

function addMarkerAntw(map, latlong, title, content) {

    var markerOptions = {
        position: latlong,
        map: map, // in welke map tonen?
        title: title,
        clickable: true // er mag op geklikt worden en er moet dan iets gebeuren
    };
    var marker = new google.maps.Marker(markerOptions);

    var infoWindowOptions = { // hoe moet infowindow er uit zien, eerst opties bepalen
        content: content,
        position: latlong
    };

    var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

    google.maps.event.addListener(marker, 'click', function() { // welke marker moet iets doen, als we er op klikken, welke functie uitvoer
        infoWindow.open(map);
    });
}

function Museum(stad, naam, adres, lat, long) {
    this.stad = stad,
        this.naam = naam,
        this.adres = adres,
        this.lat = lat,
        this.long = long
}





function init() {
    toonMapBru(50.8347929, 4.34647749);
    toonMapAntw(51.219448, 4.402464);
    dataOphalenAntw();
    dataOphalenBru();

    // var map_bru = document.getElementById("map_bru", );
    // var map_antw = document.getElementById("map_antw", );
    // addMarker(map_bru, latlong, title, content);
    // addMarker(map_antw, latlong, title, content);
}


window.onload = init;