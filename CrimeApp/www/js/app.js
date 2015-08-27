angular
		.module('demoapp', [ 'ionic', 'pickadate' ])

		.run(function($ionicPlatform) {
			$ionicPlatform.ready(function() {
				if (window.cordova && window.cordova.plugins.Keyboard) {
					cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				}
				if (window.StatusBar) {
					StatusBar.styleDefault();
				}
			});
		})

		.controller(
				'MainCtrl',
				[
						'$scope',
						'$http',
						'$ionicLoading',
						'$ionicModal',
						function($scope, $http, $ionicLoading, $ionicModal) {
							$scope.radius = '';
							$scope.searchText = '';
							var geocoder = new google.maps.Geocoder();
							var tiles = L
									.tileLayer(
											'http://{s}.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhdWhhbm1vaGl0IiwiYSI6IjE0YTljYTgyY2IzNDVlMmI0MTZhNzMwOGRkMzI4MGY3In0.vNQxFF8XYPTbbjm7fD72mg',
											{
												maxZoom : 21,
												attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
											}), latlng = L.latLng(41.8838113,
									-87.6317489);
							$scope.map = L.map('map', {
								center : latlng,
								zoom : 14,
								layers : [ tiles ]
							});
							var markers = L.markerClusterGroup({
								chunkedLoading : true
							});
							hitApi();
							function hitApi() {
								$ionicLoading.show({
									template : 'Loading...'
								});
								$http
										.get(
												'http://stagingcrimereports.herokuapp.com/showData?lat=41.8838113&lang=-87.6317489&limit=250')
										.success(
												function(res, status, config,
														header) {
													$ionicLoading.hide();
													markers.clearLayers();
													for ( var i = 0; i < res.length; i++) {
														var response = getContent(res[i]);
														var myIcon = L
																.icon({
																	iconUrl : 'img/marker-icon.png',
																	shadowUrl : 'img/marker-shadow.png'
																});
														var marker = L
																.marker(
																		[
																				res[i].latitude,
																				res[i].longitude ],
																		{
																			icon : myIcon
																		});
														marker
																.bindPopup(response);
														markers
																.addLayer(marker);
													}
													$scope.map
															.addLayer(markers);
												})
										.error(
												function(err, status, config,
														header) {
													$ionicLoading.hide();
													alert('Error');
													console
															.log("Error comes in this section");
												});
							}

							$scope.map.on('zoomend', function(e) {
								hitApi();
							})

							$scope.map.on('dragend', function(e) {
								hitApi();
							})

							$scope.groups = [];
							for ( var i = 0; i < 1; i++) {
								$scope.groups[i] = {
									name : i,
									items : []
								};
								for ( var j = 0; j < 1; j++) {
									$scope.groups[i].items.push(i + '-' + j);
								}
							}

							/**
							 * get the radius according to the viewport on
							 * initial map load
							 */
							function getRadiusOnLoad() {
								var ne = $scope.map.getBounds()._northEast;
								var pos = $scope.map.getCenter();
								var center = {
									'lat' : pos.lat,
									'lng' : pos.lng
								}
								var distance = getDistance(center, ne);
								var cal = parseFloat((distance * 10) / 100);
								var radius = parseFloat(distance + cal);
								$scope.radius = radius;
							}

							function rad(x) {
								return x * Math.PI / 180;
							}
							;

							function getDistance(p1, p2) {
								var R = 6378137; // Earth?s mean radius in
								// meter
								var dLat = rad(p2.lat - p1.lat);
								var dLong = rad(p2.lng - p1.lng);
								var a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
										+ Math.cos(rad(p1.lat))
										* Math.cos(rad(p2.lat))
										* Math.sin(dLong / 2)
										* Math.sin(dLong / 2);
								var c = 2 * Math.atan2(Math.sqrt(a), Math
										.sqrt(1 - a));
								var d = (R * c);
								return d; // returns the distance in meters
							}

							/**
							 * Marker info window data
							 */
							function getContent(data) {
								var infoData = '<div class="CustomData">'
										+ '<div class="row">'
										+ '<div class="col-sm-6"><strong>Arrest</strong>:</div>'
										+ '<div class="col-sm-3">'
										+ data.arrest
										+ '</div>'
										+ '</div>'
										+ '<div class="row">'
										+ '<div class="col-sm-6"><strong>Beat</strong>:</div>'
										+ '<div class="col-sm-3">'
										+ data.beat
										+ '</div>'
										+ '</div>'
										+ '<div class="row">'
										+ '<div class="col-sm-6"><strong>Case Number</strong>:</div>'
										+ '<div class="col-sm-3">'
										+ data.case_number
										+ '</div>'
										+ '</div>'
										+ '<div class="row">'
										+ '<div class="col-sm-6"><strong>Date</strong>:</div>'
										+ '<div class="col-sm-6">'
										+ new Date(data.date)
										+ '</div>'
										+ '</div>'
										+ '<div class="row">'
										+ '<div class="col-sm-6"><strong>Domestic</strong>:</div>'
										+ '<div class="col-sm-3">'
										+ data.domestic
										+ '</div>'
										+ '</div>'
										+ '<div class="row">'
										+ '<div class="col-sm-6"><strong>Fbi Code</strong>:</div>'
										+ '<div class="col-sm-3">'
										+ data.fbi_code
										+ '</div>'
										+ '</div>'
										+ '<div class="row">'
										+ '<div class="col-sm-6"><strong>Description</strong>:</div>'
										+ '<div class="col-sm-6">'
										+ data.description
										+ '</div>'
										+ '</div>'
										+ '<div class="row">'
										+ '<div class="col-sm-6"><strong>Primary Type</strong>:</div>'
										+ '<div class="col-sm-3">'
										+ data.primary_type
										+ '</div>'
										+ '</div>'
										+ '<div class="row">'
										+ '<div class="col-sm-6"><strong>Year</strong>:</div>'
										+ '<div class="col-sm-3">'
										+ data.year
										+ '</div>' + '</div>' + '</div>';
								return infoData;
							}

							/*
							 * if given group is the selected group, deselect it
							 * else, select the given group
							 */
							$scope.toggleGroup = function(group) {
								if ($scope.isGroupShown(group)) {
									$scope.shownGroup = null;
								} else {
									$scope.shownGroup = group;
								}
							};
							$scope.isGroupShown = function(group) {
								return $scope.shownGroup === group;
							};

							$ionicModal.fromTemplateUrl(
									'templates/datemodal.html',
									function(modal) {
										$scope.datemodal = modal;
									}, {
										scope : $scope,
										animation : 'slide-in-up'
									});

							$scope.opendateModal = function() {
								$scope.datemodal.show();
							};

							$scope.closedateModal = function(modal) {
								$scope.datemodal.hide();
								$scope.datepicker = modal;
							};

							$scope.search = function(value) {
								$scope.searchText = '';
								var markers = L.markerClusterGroup({
									chunkedLoading : true
								});
								getAddress(value);
							}

							function getAddress(value) {
								if (value != null || value !== undefined) {
									var address = value ? value : "Chicago";
									geocoder
											.geocode(
													{
														'address' : address
													},
													function(results, status) {
														if (status == google.maps.GeocoderStatus.OK) {
															var pos = results[0].geometry.location;
															$scope.map
																	.panTo(new L.LatLng(
																			pos
																					.lat(),
																			pos
																					.lng()));
															$scope.map
																	.setZoom(14);
															hitApi();
														} else {
															alert("Geocode was not successful for the following reason: "
																	+ status);
														}
													});
								}
							}

						} ]);
