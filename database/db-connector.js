// Citation for the code in this file:
//     Code is copied from, adapted from, and based on:
//     Source Title: nodejs-starter-app
//     Author(s): gkochera (George Kochera), Cortona1, currym-osu (Dr. Michael Curry), dmgs11
//     Source Type: source code and information guide
//     Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
//     Date Accessed: 7/25/2022
//
//     The following document was referenced for the dateString connection option:
//     Source Title: mysql
//     Author(s): Please find a list of the contributors to this information reference guide
//                at https://github.com/mysqljs/mysql
//     Source Type: information reference guide
//     Source URL: https://www.npmjs.com/package/mysql#connection-options
//     Date Accessed: 8/4/2022


// ./database/db-connector.js

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_goldsc',
    password        : '0479',
    database        : 'cs340_goldsc',
    dateStrings     : true
})

// Export it for use in our applicaiton
module.exports.pool = pool;