angular
		.module('starter')
		.controller(
				'MapController',
				[
						'$scope',
						'$cordovaGeolocation',
						'$stateParams',
						'$ionicModal',
						'$ionicPopup',
						'LocationsService',
						'InstructionsService',
						function($scope, $cordovaGeolocation, $stateParams,
								$ionicModal, $ionicPopup, LocationsService,
								InstructionsService) {

							/**
							 * Once state loaded, get put map on scope.
							 */
							$scope
									.$on(
											"$stateChangeSuccess",
											function() {

												$scope.locations = LocationsService.savedLocations;
												$scope.newLocation;
												$scope.map = {
													defaults : {
														tileLayer : 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
														maxZoom : 18,
														zoomControlPosition : 'bottomleft'
													},
													markers : {},
													events : {
														map : {
															enable : [ 'context' ],
															logic : 'emit'
														}
													}
												};

												$scope.goTo(0);

											});

							// $scope.map.addEventListener('dragend',function(e){
							// alert('dfgf');
							// });

							// $scope.map.on("zoomstart", function(){
							// alert('sdgdf');
							// }
							// $scope.map.addEventListener('zoomend',
							// function(e){
							// alert('sdgdf');
							// });

							var Location = function() {
								if (!(this instanceof Location))
									return new Location();
								this.lat = "";
								this.lng = "";
								this.name = "";
							};

							/**
							 * Center map on specific saved location
							 * 
							 * @param locationKey
							 */
							$scope.goTo = function(locationKey) {

								var location = LocationsService.savedLocations[locationKey];

								$scope.map.center = {
									lat : 41.8838113,
									lng : -87.6317489,
									zoom : 12
								};

								$scope.map.markers[locationKey] = {
									lat : 41.8838113,
									lng : -87.6317489,
									message : 'Chicago',
									focus : true,
									draggable : false
								};

							};

							/**
							 * Center map on user's current position
							 */
							$scope.locate = function() {

								$cordovaGeolocation
										.getCurrentPosition()
										.then(
												function(position) {
													$scope.map.center.lat = position.coords.latitude;
													$scope.map.center.lng = position.coords.longitude;
													$scope.map.center.zoom = 15;

													$scope.map.markers.now = {
														lat : 41.8838113,
														lng : -87.6317489,
														message : "You Are Here",
														focus : true,
														draggable : false
													};

												},
												function(err) {
													// error
													console
															.log("Location error!");
													console.log(err);
												});

							};

						} ]);