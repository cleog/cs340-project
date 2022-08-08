// Citation for the code in this file:
//     Code is copied from, adapted from, and based on:
//     Source Title: nodejs-starter-app
//     Author(s): gkochera (George Kochera), Cortona1, currym-osu (Dr. Michael Curry), dmgs11
//     Source Type: source code and information guide
//     Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
//     Date Accessed: 7/25/2022
//
//     Code involving use of .split and .join together on a string to replace one single quote with two single quotes is based on:
//     Source Title: How can I iterate over the characters in a string, and change them?
//     Author(s): kevinSpaceyIsKeyserSöze
//     Source Type: code snippet
//     Source URL: https://stackoverflow.com/questions/44067329/how-can-i-iterate-over-the-characters-in-a-string-and-change-them
//     Date Accessed: 8/4/2022

/*
    SETUP   
*/

var express = require('express');                   // We are using the express library for the web server
var app = express();                                // We need to instantiate an express object to interact with the server in our code
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
PORT = 9127;                                        // Set a port number at the top so it's easy to change in the future
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');         // Import express-handlebars
app.engine('.hbs', engine({ extname: ".hbs" }));    // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                     // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector')


/*
    ROUTES
*/

// GET ROUTES

app.get('/', function (req, res) { // homepage
    return res.render('index');
});

app.get('/books', function (req, res) {
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.title_name === undefined) {
        query1 = "SELECT * FROM Books;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else {
        query1 = `SELECT * FROM Books WHERE title_name LIKE "${req.query.title_name}%"`
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
                        return res.render('books', { books: book_rows, genres: genre_rows, patrons: patron_rows, publishers: publisher_rows, authors: author_rows }); //change data to books
                    })
                })
            })
        })
    })
});

app.get('/authors', function (req, res) {
    // Declare Query 1
    let query1 = "SELECT * FROM Authors;";
    db.pool.query(query1, (error, author_rows, fields) => {
        res.render('authors', {authors: author_rows});                  
        })                                                    
    });                                    

app.get('/genres', function (req, res) {
    // Declare Query 1
    let query1 = "SELECT * FROM Genres;";
    db.pool.query(query1, (error, genre_rows, fields) => {
        res.render('genres', {genres: genre_rows});                  
    })                                                      
});   

app.get('/publishers', function (req, res) {
    // Declare Query 1
    let query1 = "SELECT * FROM Publishers;";
    db.pool.query(query1, (error, publisher_rows, fields) => {
        res.render('publishers', {publishers: publisher_rows});                  
    })                                                      
});   
                    
app.get('/patrons', function (req, res) {
    // Declare Query 1
    let query1= "SELECT * from Patrons;";
    db.pool.query(query1, (error, patron_rows, fields) => {
        res.render('patrons', {patrons: patron_rows});                
        })                                                      
    });  

app.get('/books_authors', function(req, res) {
    // Declare Query 1
    let query1 = "SELECT * FROM Books_Authors;";

    // Declare Query 2
    let query2 = "SELECT book_id, title_name FROM Books;";

    // Declare Query 3
    let query3 = "SELECT author_id, author_first_name, author_last_name FROM Authors"

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){

        // Save the books_authors
        let books_authors = rows;

        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {

            // Save the books
            let books = rows;

            // Run the third query
            db.pool.query(query3, (error, rows, fields) => {

                // Save the authors
                let authors = rows;
                return res.render('books_authors', {data: books_authors, books: books, authors: authors});
            })
        })
    })
});


// POST ROUTES

app.post('/add-book-ajax', function (req, res) {  
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Code for validation
    let patron_id = parseInt(data.patron_id)

    let due_date = '\'' + data.due_date + '\''

    if (isNaN(patron_id)) {
        patron_id = 'NULL'
        due_date = 'NULL'
    }

    if (due_date === '\'\'') {
        patron_id = 'NULL'
        due_date = 'NULL'
    }
    
    // Allows book titles to contain single quotes
    let title_name = data.title_name
    title_name = title_name.split("'").join("''")

    // Create the query and run it on the database
    query1 = `INSERT INTO Books (title_name, genre_id, publisher_id, patron_id, due_date) VALUES ('${title_name}', '${data.genre_id}', '${data.publisher_id}', ${patron_id}, ${due_date})`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, insert new Book ID and associated Author ID into Books_Authors intersection table.
            query2 = `INSERT INTO Books_Authors (book_id, author_id) VALUES ((SELECT MAX(book_id) FROM Books), '${data.author_id}');`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    // If there was no error, perform a SELECT * on Books
                    query3 = `SELECT * FROM Books;`;
                    db.pool.query(query3, function (error, rows, fields) {

                        // If there was an error on the third query, send a 400
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
        }
    })
});

app.post('/add-genre-ajax', function (req, res) {  
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Allows genre name and description to contain single quotes
    let genre_name = data.genre_name
    genre_name = genre_name.split("'").join("''")

    let genre_description = data.genre_description
    genre_description = genre_description.split("'").join("''")

    // Create the query and run it on the database
    query1 = `INSERT INTO Genres (genre_name, genre_description) VALUES ('${genre_name}', '${genre_description}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on Genres
            query2 = `SELECT * FROM Genres;`;
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

app.post('/add-author-ajax', function (req, res) {  
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Allows author first and last names to contain single quotes
    let author_first_name = data.author_first_name
    author_first_name = author_first_name.split("'").join("''")

    let author_last_name = data.author_last_name
    author_last_name = author_last_name.split("'").join("''")

    // Create the query and run it on the database
    query1 = `INSERT INTO Authors (author_first_name, author_last_name) VALUES ('${author_first_name}', '${author_last_name}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on Genres
            query2 = `SELECT * FROM Authors;`;
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

app.post('/add-patron-ajax', function (req, res) {  
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

     // Allows patron first and last names to contain single quotes
    let patron_first_name = data.patron_first_name
    patron_first_name = patron_first_name.split("'").join("''")

    let patron_last_name = data.patron_last_name
    patron_last_name = patron_last_name.split("'").join("''")

    // Create the query and run it on the database
    query1 = `INSERT INTO Patrons (patron_first_name, patron_last_name, patron_phone_number) VALUES ('${patron_first_name}', '${patron_last_name}', '${data.patron_phone_number}')`;
    // patron_phone_number is varchar
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on Patrons
            query2 = `SELECT * FROM Patrons;`;
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

app.post('/add-publisher-ajax', function (req, res) {  
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Allows publisher name and country to contain single quotes
    let publisher_name = data.publisher_name
    publisher_name = publisher_name.split("'").join("''")

    let publisher_country = data.publisher_country
    publisher_country = publisher_country.split("'").join("''")

    // Create the query and run it on the database
    query1 = `INSERT INTO Publishers (publisher_name, publisher_country) VALUES ('${publisher_name}', '${publisher_country}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on Publishers
            query2 = `SELECT * FROM Publishers;`;
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

app.post('/add-books-authors-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let book_id = parseInt(data.book_id);
    if (isNaN(book_id))
    {
        book_id = 'NULL'
    }

    let author_id = parseInt(data.author_id);
    if (isNaN(author_id))
    {
        author_id = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Books_Authors (book_id, author_id) VALUES ('${data.book_id}', '${data.author_id}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Books_Authors
            query2 = `SELECT * FROM Books_Authors;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


// PUT ROUTES

app.put('/put-book-ajax', function (req, res, next) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let bookID = parseInt(data.book_id);
    let patronID = parseInt(data.patron_id);
    let dueDate = '\'' + data.due_date + '\''

    if (isNaN(patronID)) {
        patronID = 'NULL'
        dueDate = 'NULL'
    }

    if (dueDate === '\'\'') {
        patronID = 'NULL'
        dueDate = 'NULL'
    }

    let queryUpdateBook = `UPDATE Books SET patron_id = ${patronID}, due_date = ${dueDate} WHERE book_id = ${data.book_id};`
    let selectBook = `SELECT * FROM Books WHERE book_id = ?`

    // Run the 1st query
    db.pool.query(queryUpdateBook, [patronID, dueDate, bookID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the Books table on the front-end
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

app.put('/put-books-authors-ajax', function(req,res,next) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
  
    let book_author_id = parseInt(data.book_author_id);
    let author_id = parseInt(data.author_id);
  
    let queryUpdateAuthor = `UPDATE Books_Authors SET author_id = ? WHERE book_author_id = ?`;
    let selectAuthor = `SELECT * FROM Authors WHERE author_id = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateAuthor, [author_id, book_author_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the Books_Authors table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectAuthor, [author_id], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});


// DELETE ROUTES

app.delete('/delete-book-ajax/', function (req, res, next) {
    // Capture the incoming data and parse it back to a JS object
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

app.delete('/delete-genre-ajax/', function (req, res, next) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let genreID = parseInt(data.id);
    let deleteGenres = `DELETE FROM Genres WHERE genre_id = ?`;

    // Run the 1st query
    db.pool.query(deleteGenres, [genreID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
});

app.delete('/delete-author-ajax/', function (req, res, next) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let authorID = parseInt(data.id);
    let deleteAuthors = `DELETE FROM Authors WHERE author_id = ?`;

    // Run the 1st query
    db.pool.query(deleteAuthors, [authorID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
});

app.delete('/delete-patron-ajax/', function (req, res, next) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let patronID = parseInt(data.id);
    let deletePatrons = `DELETE FROM Patrons WHERE patron_id = ?`;

    // Run the 1st query
    db.pool.query(deletePatrons, [patronID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
});

app.delete('/delete-publisher-ajax/', function (req, res, next) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let publisherID = parseInt(data.id);
    let deletePublishers = `DELETE FROM Publishers WHERE publisher_id = ?`;

    // Run the 1st query
    db.pool.query(deletePublishers, [publisherID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
});

app.delete('/delete-books-authors-ajax/', function(req, res, next){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let book_author_id = parseInt(data.book_author_id);
    let deleteBooks_Authors = `DELETE FROM Books_Authors WHERE book_author_id = ?`;
  
    // Run the 1st query
    db.pool.query(deleteBooks_Authors, [book_author_id], function(error, rows, fields){
        if (error) {
  
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
        
        else {
            res.sendStatus(204);
        }

    })
});


/*
LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
