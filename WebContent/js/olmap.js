/*
var extent = [0, 0, 800000, 1300000];
var resolutions = [2500, 1000, 500, 200, 100, 50, 25, 10, 5, 2, 1];
 */
proj4
		.defs(
				"EPSG:27700",
				'+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717'
						+ ' +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs');
var proj = 'EPSG:27700';

function demCallback(featureCollection) {
	console.log(featureCollection.features[0].properties.GRAY_INDEX);
}

var openSpaceOl3 = new OpenSpaceOl3('C39E1DECE0E9A8B8E0405F0ACA60636A',
		document.URL, OpenSpaceOl3.ALL_LAYERS);

var demLayer = new ol.layer.Image({
    source: new ol.source.ImageWMS({
	      url: 'http://localhost:8080/geoserver/cropmap/wms',
	      params: {'LAYERS': 'dem'},
	      serverType: 'geoserver'
	}),
	opacity: 0.5
});

var soilLayer = new ol.layer.Image({
    source: new ol.source.ImageWMS({
	      url: 'https://map.bgs.ac.uk/arcgis/services/UKSO/UKSO_BGS_NSI/MapServer/WmsServer',
	      params: {'LAYERS': 'Topsoil.Aluminium,Topsoil.Barium'},
	}),
	opacity: 0.5,
	visible: false
});

var map = new ol.Map({
	layers : [ openSpaceOl3.getLayer(),
	           demLayer,
	           soilLayer],
	logo : false,
	target : 'olmap',
	controls : ol.control.defaults({
		attributionOptions : ({
			collapsible : false
		})
	}).extend([ new OpenSpaceOl3.OpenSpaceLogoControl({
		className : 'openspaceol3-openspace-logo'
	}) ]),
	view : new ol.View({
		projection : openSpaceOl3.getProjection(),
		center : [ 400000, 350000 ], // OS coords
		resolutions : openSpaceOl3.getResolutions(),
		resolution : openSpaceOl3.getMaxResolution()
	})
});

// Map click handler - mahe GetFeatureInfo requests
map.on('singleclick', function(evt) {
//	popup.hide();
//	popup.setOffset([0,0]);
	
	var url = demLayer.getSource().getGetFeatureInfoUrl(
			evt.coordinate,
			map.getView().getResolution(),
			map.getView().getProjection(),
			{
				'INFO_FORMAT': 'text/javascript',
				'format_options': 'callback:demCallback'
			}
	);
	

	if (url) {
		//console.log(url);

		$.ajax({
			type : 'GET',
			url : url,
			dataType : 'jsonp',
			//jsonpCallback: 'demCallback',
			success : function(data) {
				console.log(data);
			}//,
//			error : function(xhr, ajaxOptions, thrownError) {
//				console.error(xhr.status);
//				console.error(thrownError);
//			}
		});
	} else {
		console.info('could not prepare getfeatureinfo url');
	}
	
	var soilUrl = soilLayer.getSource().getGetFeatureInfoUrl(
			evt.coordinate,
			map.getView().getResolution(),
			map.getView().getProjection(),
			{
				'INFO_FORMAT': 'application/geojson',
				'format_options': 'callback:soilCallback'
			}
	);
	
	console.log(soilUrl);
	
	var latlon = ol.proj.transform(evt.coordinate, 'EPSG:27700', 'EPSG:4326');
	console.log(latlon);
	
	if (soilUrl) {
		//console.log(url);
		
		soilUrl = "https://map.bgs.ac.uk/arcgis/services/UKSO/UKSO_BGS_NSI/MapServer/WmsServer?&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&X=1587&Y=281&QUERY_LAYERS=Topsoil.Aluminium,Topsoil.Barium&LAYERS=Topsoil.Aluminium&INFO_FORMAT=text/html&BBOX=-432113.73538136424,7044741.059533565,-138595.546766175,7139828.722720361&CRS=EPSG:102100&WIDTH=1920&HEIGHT=622&feature_count=5";


	} else {
		console.info('could not prepare getfeatureinfo url');
	}
})


/*
 * var map = new ol.Map({ layers: [ new ol.layer.Tile({ source: new
 * ol.source.TileWMS({ url: 'http://openspace.ordnancesurvey.co.uk/osmapapi/ts',
 * params: { 'VERSION': '1.1.1', 'LAYERS': '1000', // initial value; see view
 * resolution below 'KEY': '5A4E80E3BABD59F6E0405F0AF1604498', 'URL':
 * document.URL }, attributions: [new ol.Attribution({ html: 'Topo maps &copy;
 * Crown copyright and database rights ' + new Date().getFullYear() + ' <span
 * style="white-space: nowrap;">Ordnance Survey.</span>' + '&nbsp;&nbsp;<span
 * style="white-space: nowrap;">' + '<a
 * href="http://openspace.ordnancesurvey.co.uk/openspace/developeragreement.html#enduserlicense"' +
 * 'target="_blank">End User License Agreement</a></span>' })], logo:
 * 'http://openspace.ordnancesurvey.co.uk/osmapapi/img_versions/img_4.0.0/OS/poweredby_free.png',
 * extent: extent, projection: proj, // needs tilegrid otherwise uses
 * inappropriate global grid tileGrid: new ol.tilegrid.TileGrid({ tileSizes:
 * [200, 200, 200, 200, 200, 200, 200, 200, 200, 250, 250], resolutions:
 * resolutions, origin: [0, 0] }) }) }) ], target: 'olmap', view: new ol.View({
 * projection: proj, center: [400000, 650000], resolution: 1000, resolutions:
 * resolutions }) });
 */

// layers param needs to be changed on change of resolution
map.getView().on('change:resolution', function(evt) {
	map.getLayers().item(0).getSource().updateParams({
		LAYERS : evt.target.getResolution()
	});
});