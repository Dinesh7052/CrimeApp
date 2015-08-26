var appM = angular.module('starter.services', [])

appM
		.service(
				'MapServices',
				function($http, $rootScope, $q, $ionicLoading) {
					return {
						/**
						 * This function is used to get distance between two
						 * location using lattitude and longitude*
						 */
						getDistance : function(p1, p2) {
							var R = 6378137; // Earth?s mean radius in meter
							var dLat = this.rad(p2.G - p1.G);
							var dLong = this.rad(p2.K - p1.K);
							var a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
									+ Math.cos(this.rad(p1.lat()))
									* Math.cos(this.rad(p2.lat()))
									* Math.sin(dLong / 2) * Math.sin(dLong / 2);
							var c = 2 * Math.atan2(Math.sqrt(a), Math
									.sqrt(1 - a));
							var d = (R * c);
							return d; // returns the distance in meters
						},
						validationAlert : function(message) {

							return message;

						},
						rad : function(x) {
							return x * Math.PI / 180;
						},
						bindInfoWindow : function(marker, map, infowindow,
								content) {

							google.maps.event.addListener(marker, 'click',
									function(e) {
										var data = this.getContent(content);
										infowindow.close();
										infowindow.setContent(data);
										infowindow.open(map, marker);
									});
						},
						getContent : function(data) {
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
									+ '<div class="col-sm-3">'
									+ data.date
									+ '</div>'
									+ '</div>'
									+ '<div class="row">'
									+ '<div class="col-sm-6"><strong>Description</strong>:</div>'
									+ '<div class="col-sm-3">'
									+ data.description
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
									+ '<div class="col-sm-3">'
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
									+ data.arrest
									+ '</div>' + '</div>' + '</div>';
							return infoData;

						},
					}
				});
