angular
		.module('starter.controllers', [ 'pickadate' ])

		.controller(
				'MapController',
				function($scope, $http, MapServices, $ionicLoading,
						$ionicLoading, $ionicModal) {
					$scope.location = {};
					$scope.newPlaceAddress = "Chicago";
					$scope.location.latitude = 41.8838113;
					$scope.location.longitude = -87.6317489;
					$scope.limit = 100;
					$scope.showLoder = false;
					$ionicLoading.hide();
					$scope.dynMarkers = [];
					$scope.tempLocation = '';
					$scope.tempZoomLevel = '';
					google.maps.event
							.addDomListener(
									window,
									'load',
									function() {
										var myLatlng = new google.maps.LatLng(
												41.8838113, -87.6317489);

										var mapOptions = {
											center : myLatlng,
											zoom : 13,
											mapTypeId : google.maps.MapTypeId.ROADMAP
										};
										var map = new google.maps.Map(document
												.getElementById("map"),
												mapOptions);

										/**
										 * This function is called when Zoom
										 * action is performed on map
										 */
										google.maps.event
												.addListener(
														map,
														'zoom_changed',
														function() {
															var minZoomLevel = 12;
															var zoomLevel = map
																	.getZoom();
															if (zoomLevel < minZoomLevel)
																map
																		.setZoom(minZoomLevel);
															var bounds = map
																	.getBounds();
															var ne = bounds
																	.getNorthEast();
															var sw = bounds
																	.getSouthWest();
															var d = MapServices
																	.getDistance(
																			map.center,
																			ne);
															var loc = map.center;
															$scope.tempLocation = map.center;
															if (zoomLevel <= 18) {
																$scope
																		.hitApi(
																				map,
																				zoomLevel);
															}
														});

										/**
										 * This Function is used to get data
										 * from api
										 */
										$scope.hitApi = function(map, zoomLevel) {
											$scope.tempLocation = map.center;
											$scope.tempZoomLevel = zoomLevel;
											var limit = $scope.limit;
											if (!limit)
												limit = 100;
											$scope.showLoder = true;
											$ionicLoading.show({
												template : 'Loading...'
											});
											$http
													.get(
															'http://stagingcrimereports.herokuapp.com/showData?lat='
																	+ $scope.location.latitude
																	+ '&lang='
																	+ $scope.location.longitude
																	+ '&limit='
																	+ limit)
													.success(
															function(res,
																	status,
																	config,
																	header) {
																$scope.shortlistedData = res;
																for ( var i = 0; i < res.length; i++) {
																	var latLng = new google.maps.LatLng(
																			res[i].latitude,
																			res[i].longitude);
																	var image = res[i].primary_type == 'ASSAULT' ? 'img/matrimonial.png'
																			: res[i].primary_type == 'NARCOTICS' ? 'img/medical.png'
																					: res[i].primary_type == 'BATTERY' ? 'img/local-services.png'
																							: 'img/saloon.png';
																	var marker = new google.maps.Marker(
																			{
																				map : map,
																				position : latLng,
																				icon : image,
																			});
																	var infowindow = new google.maps.InfoWindow();
																	MapServices
																			.bindInfoWindow(
																					marker,
																					map,
																					infowindow,
																					res[i]);
																	$scope.dynMarkers
																			.push(marker);
																}
																$scope.markerClusterer = new MarkerClusterer(
																		map,
																		$scope.dynMarkers,
																		{
																			maxZoom : 20,
																			zoomOnClick : false
																		});
																$scope.showLoder = false;
																$ionicLoading
																		.hide();
															})
													.error(
															function(err,
																	status,
																	config,
																	header) {
																console
																		.log("Error comes in this section");
															});

										}

										/**
										 * This Function is call when map is
										 * dragged
										 */
										google.maps.event
												.addListener(
														map,
														"dragend",
														function() {
															if ($scope.tempLocation != null
																	&& $scope.tempZoomLevel >= 18) {
																var dis = MapServices
																		.getDistance(
																				map.center,
																				$scope.tempLocation);
																if (dis > 100
																		&& $scope.tempZoomLevel == 18) {
																	$scope
																			.hitApi(
																					map,
																					$scope.tempZoomLevel);
																}
															}
														});

										navigator.geolocation
												.getCurrentPosition(function(
														pos) {
													map
															.setCenter(new google.maps.LatLng(
																	pos.coords.latitude,
																	pos.coords.longitude));
													var myLocation = new google.maps.Marker(
															{
																position : new google.maps.LatLng(
																		pos.coords.latitude,
																		pos.coords.longitude),
																map : map,
																title : "My Location"
															});
													alert("Inside getCurrentPosition method");
												});

										$scope.map = map;
									});

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

					/*
					 * if given group is the selected group, deselect it else,
					 * select the given group
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

					$ionicModal.fromTemplateUrl('templates/datemodal.html',
							function(modal) {
								$scope.datemodal = modal;
							}, {
								// Use our scope for the scope of the modal to
								// keep it simple
								scope : $scope,
								// The animation we want to use for the modal
								// entrance
								animation : 'slide-in-up'
							});
					$scope.opendateModal = function() {
						$scope.datemodal.show();
					};
					$scope.closedateModal = function(modal) {
						$scope.datemodal.hide();
						$scope.datepicker = modal;
					};

				});
