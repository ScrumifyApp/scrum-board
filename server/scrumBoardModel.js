const { Pool } = require('pg');

//OLD URI
// const PG_URI =
// 	'postgres://fiwaqomz:KaF3rjCKaAbLr8DUoXYn3mnLtjesv6Zc@salt.db.elephantsql.com/fiwaqomz';

//CURRENT URI
const PG_URI =
	'postgres://ebozpmxl:W86S2AdtS5ginHZ1UQei6jX9R5TwEbUf@mahmud.db.elephantsql.com/ebozpmxl';
// create a new pool here using the connection string above
const pool = new Pool({
	connectionString: PG_URI,
});

// Adding some notes about the database here will be helpful for future you or other developers.
// Schema for the database can be found below:
// https://api.elephantsql.com/console/006b8a25-150e-4e8c-995f-b6656acda209/details?

// We export an object that contains a property called query,
// which is a function that returns the invocation of pool.query() after logging the query
// This will be required in the controllers to be the access point to the database
module.exports = {
	query: (text, params, callback) => {
		// console.log('executed query', text);
		return pool.query(text, params, callback);
	},
};
