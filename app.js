// App.js

/*
    SETUP
*/
// app.js

var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
PORT = 9127;                 // Set a port number at the top so it's easy to change in the future
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
// Database
var db = require('./database/db-connector')


/*
    ROUTES
*/
// app.js

// app.get('/', function(req, res)
//     {  
//         let query1 = "SELECT * FROM Books;";               // Define our query

//         db.pool.query(query1, function(error, rows, fields){    // Execute the query

//             res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
//         })                                                      // an object where 'data' is equal to the 'rows' we
//     });                                                         // received back from the query                                       // will process this file, before sending the finished HTML to the client.
// app.js - ROUTES section

// app.post('/add-book-ajax', function(req, res) 
// {
//     // Capture the incoming data and parse it back to a JS object
//     let data = req.body;

//     // Capture NULL values
//     let patron_id = parseInt(data.patron_id);
//     if (isNaN(patron_id))
//     {
//         patron_id = 'NULL'
//     }

//     let due_date = parseInt(data.due_date);
//     if (isNaN(due_date))
//     {
//         due_date = 'NULL'
//     }

//     // Create the query and run it on the database
//     // query1 = `INSERT INTO Books (book_id, publisher_id, genre_id, title_name, due_date, patron_id) VALUES ('${data.book_id}', '${data.publisher_id}', '${data.genre_id}', '${data.title_name}', '${data.due_date}', '${data.patron_id}')`;
//     query1 = `INSERT INTO Books (publisher_id, genre_id, title_name, due_date, patron_id) VALUES ('${data.publisher_id}', '${data.genre_id}', '${data.title_name}', '${data.due_date}', '${data.patron_id}')`;
//     db.pool.query(query1, function(error, rows, fields){

//         // Check to see if there was an error
//         if (error) {

//             // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
//             console.log(error)
//             res.sendStatus(400);
//         }
//         else
//         {
//             // If there was no error, perform a SELECT * on bsg_people
//             query2 = `SELECT * FROM Books;`;
//             db.pool.query(query2, function(error, rows, fields){

//                 // If there was an error on the second query, send a 400
//                 if (error) {

//                     // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
//                     console.log(error);
//                     res.sendStatus(400);
//                 }
//                 // If all went well, send the results of the query back.
//                 else
//                 {
//                     res.send(rows);
//                 }
//             })
//         }
//     })
// });

app.post('/add-book-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    // let homeworld = parseInt(data.homeworld);
    // if (isNaN(homeworld))
    // {
    //     homeworld = 'NULL'
    // }

    // let age = parseInt(data.age);
    // if (isNaN(age))
    // {
    //     age = 'NULL'
    // }

    if (data.patron_id == 'NULL')
        data.due_date = 'NULL'

    // Create the query and run it on the database
    query1 = `INSERT INTO Books (title_name, genre_id, publisher_id, patron_id, due_date) VALUES ('${data.title_name}', '${data.genre_id}', '${data.publisher_id}', '${data.patron_id}', '${data.due_date}')`;
console.log(query1)
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Books;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.get('/', function (req, res) { // homepage
    return res.render('index');
});


app.get('/books', function (req, res) {
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.title_name === undefined) {
        query1 = "SELECT book_id, title_name, genre_id, publisher_id, patron_id, due_date FROM Books;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else {
        query1 = `SELECT book_id, title_name, genre_id, publisher_id, patron_id, due_date FROM Books WHERE title_name LIKE "${req.query.title_name}%"`
    }

    // These queries are for dropdown data
    let queryGenres = "SELECT genre_id, genre_name FROM Genres;";
    let queryPatrons = "SELECT patron_id, patron_first_name, patron_last_name from Patrons;";
    let queryPublishers = "SELECT publisher_id, publisher_name FROM Publishers;";
    let queryAuthors = "SELECT author_id, author_first_name, author_last_name FROM Authors;";

    // Run the queries in sequence
    db.pool.query(query1, function (error, book_rows, fields) {
        db.pool.query(queryGenres, (error, genre_rows, fields) => {
            db.pool.query(queryPatrons, (error, patron_rows, fields) => {
                db.pool.query(queryPublishers, (error, publisher_rows, fields) => {
                    db.pool.query(queryAuthors, (error, author_rows, fields) => {
                        return res.render('books', { data: book_rows, genres: genre_rows, patrons: patron_rows, publishers: publisher_rows, authors: author_rows });
                    })
                })
            })
        })
    })
});


app.get('/authors', function (req, res) {
    // Declare Query 1
    let query1 = "SELECT author_id, author_first_name, author_last_name FROM Authors;";
    db.pool.query(query1, (error, author_rows, fields) => {
        res.render('authors', {authors: author_rows});                  
        })                                                    
    });                                    


app.get('/genres', function (req, res) {
    // Declare Query 1
    let query1 = "SELECT genre_id, genre_name, genre_description FROM Genres;";
    db.pool.query(query1, (error, genre_rows, fields) => {
        res.render('genres', {genres: genre_rows});                  
    })                                                      
});   


app.get('/publishers', function (req, res) {
    // Declare Query 1
    let query1 = "SELECT publisher_id, publisher_name, publisher_country FROM Publishers;";
    db.pool.query(query1, (error, publisher_rows, fields) => {
        res.render('publishers', {publishers: publisher_rows});                  
    })                                                      
});   
                    

app.get('/patrons', function (req, res) {
    // Declare Query 1
    let query1= "SELECT patron_id, patron_first_name, patron_last_name, patron_phone_number from Patrons;";
    db.pool.query(query1, (error, patron_rows, fields) => {
        res.render('patrons', {patrons: patron_rows});                
        })                                                      
    });  
    
app.get('/books_authors', function (req, res) {
    let query1= "SELECT book_author_id, book_id, author_id FROM Books_Authors;";
    db.pool.query(query1, (error, books_authors_rows, fields) => {
        res.render('books_authors', {books_authors: books_authors_rows});                
        })                                                      
    });  


app.put('/put-book-ajax', function (req, res, next) {
    let data = req.body;

    let bookID = parseInt(data.book_id);
    let patronID = parseInt(data.patron_id);
    let dueDate = data.due_date;

    let queryUpdatePatronID = `UPDATE Books SET patron_id = ?, due_date = ? WHERE book_id = ?;`;
    // let queryUpdateDueDate = `UPDATE Books SET due_date = ? WHERE Books.book_id = ?`;
    let selectBook = `SELECT * FROM Books WHERE book_id = ?`

    // Run the 1st query
    db.pool.query(queryUpdatePatronID, [patronID, dueDate, bookID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectBook, [bookID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-book-ajax/', function (req, res, next) {
    let data = req.body;
    let bookID = parseInt(data.id);
    let deleteBooks_Authors = `DELETE FROM Books_Authors WHERE book_id = ?`;
    let deleteBooks = `DELETE FROM Books WHERE book_id = ?`;


    // Run the 1st query
    db.pool.query(deleteBooks_Authors, [bookID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            // Run the second query
            db.pool.query(deleteBooks, [bookID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

/*
LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});