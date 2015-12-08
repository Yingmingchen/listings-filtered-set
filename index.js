var express = require('express');
var request = require('request');
var app = express();
var pg = require('pg');

/**
 * Helper function to create the query that we want perform for the given request
 * @param {object} req
 * @returns {string} query string
 * @private
 */
function createQuery(req) {
	var query = 'select * from listings_data';
	var whereClause = [];

	if (req.query.min_price) {
		var minPrice = parseInt(req.query.min_price);
		if (minPrice) whereClause.push('price >= ' + minPrice);
	}
	if (req.query.max_price) {
		var maxPrice = parseInt(req.query.max_price);
		if (maxPrice) whereClause.push('price <= ' + maxPrice);
	}
	if (req.query.min_bed) {
		var minBed = parseInt(req.query.min_bed);
		if (minBed) whereClause.push('bedrooms >= ' + minBed);
	}
	if (req.query.max_bed) {
		var maxBed = parseInt(req.query.max_bed);
		if (maxBed) whereClause.push('bedrooms <= ' + maxBed);
	}
	if (req.query.min_bath) {
		var minBath = parseInt(req.query.min_bath);
		if (minBath) whereClause.push('bathrooms >= ' + minBath);
	}
	if (req.query.max_bath) {
		var maxBath = parseInt(req.query.max_bath);
		if (maxBath) whereClause.push('bathrooms <= ' + maxBath);
	}

	if (whereClause.length > 0) {
		query += ' where ' + whereClause.join(' and ');
	}

	return query;
}

/**
 * Helper function to convert the db result to GeoJSON format
 * @param {object} listingsData
 * @returns {object} GeoJSON object
 * @private
 */
function formGeoJSONFeatureCollection(listingsData) {
	var geoJSON = {
		type: 'FeatureCollection',
		features: []
	};

	listingsData.rows.forEach(function(row) {
		var feature = {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: []
			},
			properties: {
				id: row.id,
				price: row.price,
				street: row.street,
				bedrooms: row.bedrooms,
				bathrooms: row.bathrooms,
				sq_ft: row.sqft
			}
		};

		feature.geometry.coordinates.push(row.lat);
		feature.geometry.coordinates.push(row.lng);
		geoJSON.features.push(feature);
	});

	return geoJSON;
}

// Express route for listings
app.get('/listings', function (req, res) {
	// Establish a connect to db
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		// Handle connection error
		if (err) {
			console.error(err);
			res.status(503).send('Error: ' + err);
			return;
		}

		var query = createQuery(req);
		console.log('Listings query: ' + query);
		// initializes a connection pool
		client.query(query, function(err, listingsData) {
			//call `done()` to release the client back to the pool
			done();
			if (err) {
				console.error(err);
				res.status(503).send('Error: ' + err);
				return;
			}
			console.log('Row #: ' + listingsData.rows.length);
			res.send(formGeoJSONFeatureCollection(listingsData));
		});
	});
});

app.set('port', (process.env.PORT || 8081));
app.listen(app.get('port'));
console.log('Node app is running on port ' + app.get('port'));
