require('date-utils');

var restler = require('restler')
  , engine = require('engine.io')
  , http = require('http').createServer().listen(process.env.PORT || 8080)
  , async = require('async')
  , colors = require('colors')
  , server = engine.attach(http)
  , hotels = new Array()
  , count = new Array();

function getHotelCountParallelCalls() {
	var functions = new Array();
	hotels.forEach(function(hotel) {
		var COUNT_VISITORS_URL = '/json/bookings.countHotelVisitors?';
		functions.push(function(callback) {
			restler.get(BASE_SERVICE_URL + COUNT_VISITORS_URL, {
				'username': BOOKING_API_AUTH_USER,
				'password': BOOKING_API_AUTH_PASSWORD,
				'query': {
					'update': 1,
					'hotel_id': hotel.hotel_id
				},
			}).on('complete', function(result) {
				callback(null, result.count);
			});
		});
	});

	return functions;
}

function getResults() {
	var results = new Array();
	for (var i = 0; i < hotels.length; i++) {
		var hotel = hotels[i];
		results.push({
			'hotel_name': hotel.hotel_name,
			'district': hotel.district,
			'address': hotel.address,
			'main_photo_url': hotel.main_photo_url,
			'count': count[i]
		});
	};

	return results;
}

var BASE_SERVICE_URL = 'https://iphone-xml.booking.com:443';
var BOOKING_API_AUTH_USER = process.env.BOOKING_API_AUTH_USER;
var BOOKING_API_AUTH_PASSWORD = process.env.BOOKING_API_AUTH_PASSWORD;
var BOOKING_API_HOTEL_COUNT_POLLING_TIMEOUT = 10000;

server.on('connection', function (socket) {
	var timeoutId = undefined;

	socket.on('message', function (data) {
		var requestJson = JSON.parse(data.toString());
		/*
		 * pull hotels nearby information, with visitors count for a given
		 * latitude and longitude.
		 * {"event": "count", "data": {"latitude": -34.92228912884126, "longitude": -56.15353741520699}}
		 */
		if ('count' == requestJson.event) {
			var data = requestJson.data;
			if (data.latitude && data.longitude) {
				console.log(('[socket message: count] hotels nearby @[' + data.latitude + ', '
					+ data.longitude + '].').green);

				var HOTEL_AVAILABILITY_URL = '/json/bookings.getHotelAvailabilityMobile';
				restler.get(BASE_SERVICE_URL + HOTEL_AVAILABILITY_URL, {
					'username': BOOKING_API_AUTH_USER,
					'password': BOOKING_API_AUTH_PASSWORD,
					'query': {
						'latitude': data.latitude,
						'longitude': data.longitude,
						'rows': 20,
						'arrival_date': Date.today().toYMD("-"),
						'departure_date' : Date.tomorrow().toYMD("-")
					}
				}).on('complete', function(result) {
					result['result'].forEach(function(hotel) {
						hotels.push(hotel);
					});

					var getHotelCount = function() {
						async.parallel(getHotelCountParallelCalls(), function(err, results) {
							if (server.clientsCount > 0) {
								count = results;
								var response = JSON.stringify({ 'status': 'OK', 'results': getResults() });
								socket.send(response);
								
								console.log(('[socket response] ' + count.length + ' hotels found.').magenta);
								timeoutId = setTimeout(getHotelCount, BOOKING_API_HOTEL_COUNT_POLLING_TIMEOUT);
							};
						});
					}

					getHotelCount();
				});
			} else {
				var response = JSON.stringify({ 'status': 'INVALID_REQUEST', 'results': [] });
				socket.send(response);
			}
		}
	});

	socket.on('close', function () {
		console.log('[socket closed]'.red);
		clearInterval(timeoutId);
		hotels = new Array(); count = new Array();
	});
});