const { Pool } = require('pg')

module.exports = new Pool({
    user: 'postgres',
    password: "756942",
    host: 'localhost',
    port: 5432,
    database: "dbFoodfy"
})