# listings-filtered-set

A simple Node.js app using [Express](http://expressjs.com/) to provide an API endpoint that returns a filtered set of listings from the data stored in Postgres.

Table creation: *create table listings_data (id integer, street text, status text, price integer, bedrooms integer, bathrooms integer, sqft integer, lat float8, lng float8)*

Table import: *\copy listings_data FROM 'listings.csv' DELIMITER ',' CSV HEADER;*

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
$ cd listings-filtered-set
$ npm start
```
Your app should now be running on [localhost:8081](http://localhost:8081/listings).

## Access It Online

[listings-filtered-set2.herokuapp.com](https://listings-filtered-set2.herokuapp.com/listings)

## Possible Enhancements:
* Pagination via web linking using id for cursoring
* Better parsing against query parameters
* Adding index to the table to improve the query performance
