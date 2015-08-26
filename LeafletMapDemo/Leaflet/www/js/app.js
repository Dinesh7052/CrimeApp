var app = angular.module('demoapp', [])

app
		.controller(
				'MainCtrl',
				function($scope, $http) {
					$scope.map = L.map('map').setView(
							[ 41.8838113, -87.6317489 ], 14);
					L
							.tileLayer(
									'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg',
									{
										attribution : 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
										subdomains : '1234',
										maxZoom : 19
									}).addTo($scope.map);
					var markers = L.markerClusterGroup({
						chunkedLoading : true
					});
					$http
							.get(
									'http://stagingcrimereports.herokuapp.com/showData?lat=41.8838113&lang=-87.6317489&limit=100')
							.success(
									function(res, status, config, header) {
										for ( var i = 0; i < res.length; i++) {
											var image = res[i].primary_type == 'ASSAULT' ? 'img/matrimonial.png'
													: res[i].primary_type == 'NARCOTICS' ? 'img/medical.png'
															: res[i].primary_type == 'BATTERY' ? 'img/local-services.png'
																	: 'img/saloon.png';
											var myIcon = L
													.icon({
														iconUrl : 'img/marker-icon.png',
														shadowUrl : 'img/marker-shadow.png'
													});
											var marker = L.marker([
													res[i].latitude,
													res[i].longitude ], {
												icon : myIcon
											});
											markers.addLayer(marker);
										}
										$scope.map.addLayer(markers);
									})
							.error(function(err, status, config, header) {
								alert('Error');
								console.log("Error comes in this section");
							});
				});
