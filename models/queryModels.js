const { Pool } = require('pg');
// import the keys file that you add to gitignore
const keys = require('../config/keys');

const PG_URI =
  // this will need to change to something local
  keys.postg.dbURI;

// create a new pool here using the connection string above
const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};
