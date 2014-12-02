

$(document).ready(function() {

	var cities;
	var map = L.map('map', {
			zoomControl:false,
			center: [48.873, 2.3577662],
			
			zoom: 15,
			minZoom: 12,
			maxZoom: 20,
		
		});

	L.tileLayer(
		'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
			attribution: 'Acetate tileset from OSM' + '<br>'+'UW Madison'
	}).addTo(map);

//code bank 7&9&12
	$.getJSON("data/Locationsv4.geojson")
		.done(function(data)  {
			
		var info = processData(data);
		//createPropSymbols(info.pages, data);
		//createLegend(info.min,info.max);
		//createSliderUI(info.pages);
		//createZoomslider()
			var points = L.geoJson(data, {
				onEachFeature: function (features, layer) {
					layer.bindPopup("SM: <b>" + features.properties.SM + "</b><br>" +features.properties.Address + "<br> Page " +features.properties.Page) 
				}
			}).addTo(map);
		})
		.fail(function()  {alert("There has been a problem loading the data.")});


// //CB18
// function createSliderUI(pages) {
	
// 	var sliderControl = L.control({ position: 'bottomleft'} );
	
// 	sliderControl.onAdd = function(map) {
			
// 			var slider = L.DomUtil.create("input", "range-slider");

// 			L.DomEvent.addListener(slider, 'mousedown', function(e) {
				
// 				L.DomEvent.stopPropagation(e);
// 			});

// 			$(slider)
// 				.attr({'type':'range',
// 					'max': Number(pages[pages.length-1]),
// 					'min':Number(pages[0]),
// 					'step':1,
// 					'value': String(pages[0])
// 				}).on('input change', function() {
// 						updatePropSymbols($(this).val().toString());
// 						$(".temporal-legend").text(this.value);
// 					});
// 				return slider;
// 			}

// 			sliderControl.addTo(map)
// 			createTemporalLegend(pages[0]);
// }
// //endCB18



//CB20
// function createTemporalLegend(startTimestamp){
// 	var temporalLegend = L.control({ position: 'bottomleft' });

// 	temporalLegend.onAdd = function(map) {
// 		var output = L.DomUtil.create("output", "temporal-legend");
// 		$(output).text(startTimestamp);
// 		return output;
// 	}

// 	temporalLegend.addTo(map);
// }
//End CB20


// function createPropSymbols(pages, data) {
// 	cities = L.geoJson(data, {

// 		pointToLayer: function(feature, latlng) {

// 			return L.circleMarker(latlng, {
// 					fillColor: "blue",
// 					color: 'blue',
// 					weight:1.5,
// 					fillOpacity: 0.6,
// 			}).on({

// 				mouseover: function(e) {
// 					this.openPopup();
// 					this.setStyle({fillColor: "yellow"});
// 				},
// 				mouseout: function(e) {
// 					this.closePopup();
// 					this.setStyle({fillColor: "blue"});
// 				},
// 				click: function(e) {
// 					this.setStyle({fillColor: 'red'});
// 				},
// 				});
// 			}
// 		}).addTo(map);

// 	updatePropSymbols(pages[0]);
// }	
// //end createPropSymbols





// //CB 13
// function updatePropSymbols(timestamp) {

// 	cities.eachLayer(function(layer) {
		
// 		var props = layer.feature.properties;
// 		var radius = calcPropRadius(props[timestamp]);
// 		var popupContent = "<b>" + timestamp + "<br>"+ 
// 				String(props[timestamp]) +"</b><br>" +
// 				"<i>" + SM +"<br>"+"</i>";

// 			layer.setRadius(radius);
// 			layer.bindPopup(popupContent, {offset: new L.Point(0,-radius) });
// 		});
// }






// function calcPropRadius(attributeValue) {
	
// 	var scaleFactor = 4.05;
// 	var area = Math.pow(attributeValue,scaleFactor)/300000;
// 	return Math.sqrt(area/Math.PI)*2;
// }
// //end CB13







	// function createLegend(min, max) {

	// 	if (min < 10) {
	// 		min =50;

	// 	}

	// 		if (max < 100) {
	// 			max = 100
	// 			}

	// 	var legend = L.control( { position: 'bottomright' } );

	// 	legend.onAdd = function(map) {

	// 		var legendContainer = L.DomUtil.create("div", "legend");
	// 		var	symbolsContainer = L.DomUtil.create("div", "symbolsContainer");
	// 		var	classes = [min, (max+min)/2, max];
	// 		var	legendCircle;
	// 		var	lastRadius = 0;
	// 		var  currentRadius;
	// 		var  margin;


	// 		L.DomEvent.addListener(legendContainer, 'mousedown', function(e) {
	// 			L.DomEvent.stopPropagation(e);
	// 		});

	// 		$(legendContainer).append("<h2 id='legendTitle'>Sufficiency" + "<br>" + "Rating</h2>");

	// 		for (var i = 0; i <= classes.length-1; i++) {

	// 			legendCircle = L.DomUtil.create("div", "legendCircle");

	// 			currentRadius = calcPropRadius(classes[i]);

	// 			margin = -currentRadius - lastRadius - 2;

	// 			$(legendCircle).attr("style", "width: " + (currentRadius*2) +
	// 				"px; height: " + (currentRadius*2) +
	// 				"px; margin-left: " + margin + "px" );


	// 			$(legendCircle).append("<span id='a"+classes[i]+"' class='legendValue'>"+classes[i]+"<span>");

	// 			$(symbolsContainer).append(legendCircle);

	// 			lastRadius = currentRadius;

	// 		}
			
	// 		$(legendContainer).append(symbolsContainer);

	// 		return legendContainer;

	// 	};

	// 	legend.addTo(map);

	// 	$("#a"+((max+min)/2)).css("margin-top", "-3px")
	// } // end createLegend()



	
var zoomFS = new L.Control.ZoomFS(); 
   map.addControl(zoomFS);

var zoomSlider = new L.Control.Zoomslider();
	map.addControl(zoomSlider);





	//code bank 8 
function processData(data) {
	var pages = [];
	var min = Infinity;
	var max = -Infinity;
	for (var feature in data.features) {

		var properties = data.features[feature].properties;

		for (var attribute in properties) {


			if( attribute != "SM" &&
				attribute != "Address" &&
				attribute != "Page" &&
				attribute != "City" &&
				attribute != "Country" &&
				attribute != "Latitude" &&
				attribute != "Longitude")
			
			
			{
				if ( $.inArray(attribute,pages) === -1) {
					pages.push(attribute);
				}

				if (properties[attribute] < min) {
					min = properties[attribute];
				}
				
				if (properties[attribute] > max) {
					max = properties[attribute];
				}			
			}	
		}
	}

	return {
		pages : pages,
//		SM : SM,
//		Page : Page,
		min : min,
		max : max
			}
	} //end processData()




})