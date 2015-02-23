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

var openSpaceOl3 = new OpenSpaceOl3('EB8FE9471221364EE0430B6CA40A6BDC',
		document.URL, OpenSpaceOl3.ALL_LAYERS);
var map = new ol.Map({
	layers : [ openSpaceOl3.getLayer() ],
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
/*
 var map = new ol.Map({
 layers: [
 new ol.layer.Tile({
 source: new ol.source.TileWMS({
 url: 'http://openspace.ordnancesurvey.co.uk/osmapapi/ts',
 params: {
 'VERSION': '1.1.1',
 'LAYERS': '1000', // initial value; see view resolution below
 'KEY': '5A4E80E3BABD59F6E0405F0AF1604498',
 'URL': document.URL
 },
 attributions: [new ol.Attribution({
 html: 'Topo maps &copy; Crown copyright and database rights ' + 
 new Date().getFullYear() + 
 ' <span style="white-space: nowrap;">Ordnance Survey.</span>' +
 '&nbsp;&nbsp;<span style="white-space: nowrap;">' +
 '<a href="http://openspace.ordnancesurvey.co.uk/openspace/developeragreement.html#enduserlicense"' +
 'target="_blank">End User License Agreement</a></span>'
 })],
 logo: 'http://openspace.ordnancesurvey.co.uk/osmapapi/img_versions/img_4.0.0/OS/poweredby_free.png',
 extent: extent,
 projection: proj,
 // needs tilegrid otherwise uses inappropriate global grid
 tileGrid: new ol.tilegrid.TileGrid({
 tileSizes: [200, 200, 200, 200, 200, 200, 200, 200, 200, 250, 250],
 resolutions: resolutions,
 origin: [0, 0]
 })
 })
 })
 ],
 target: 'olmap',
 view: new ol.View({
 projection: proj,
 center: [400000, 650000],
 resolution: 1000,
 resolutions: resolutions
 })
 });
 */

// layers param needs to be changed on change of resolution
map.getView().on('change:resolution', function(evt) {
	map.getLayers().item(0).getSource().updateParams({
		LAYERS : evt.target.getResolution()
	});
});