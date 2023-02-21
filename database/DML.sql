-- Cleo Golds, Alvin Chan
-- CS 340 Group 15 - ACE
-- Project Title: Library Database System
-- Citation: Code is similar to code in Oregon State University CS340 explorations.

-- get all books for the Books page
SELECT book_id AS `Book ID`, title_name AS `Title Name`, genre_id AS `Genre ID`, publisher_id AS `Publisher ID`, patron_id AS `Patron ID`, due_date AS `Due Date` FROM Books;

-- add a new book to the library
-- colon : character before a variable denotes that the information will be submitted by the user
INSERT INTO Books (title_name, genre_id, publisher_id, patron_id, due_date) VALUES
(:title_name_input, :genre_id_from_dropdown_input, :publisher_id_from_dropdown_input, :patron_id_from_dropdown_input, :due_date_input);

-- updates that a book is ready for check out (patron_id is NULL) or has been checked out by a patron (and also updates its due date)
-- colon : character before a variable denotes that the information will be submitted by the user
UPDATE Books SET patron_id = :patron_id_from_dropdown_input, due_date = :due_date_input
WHERE book_id = :book_id_from_dropdown_input;

-- get all authors for the Authors page
SELECT author_id AS `Author ID`, author_first_name AS `Author First Name`, author_last_name AS `Author Last Name` FROM Authors;

-- add a new author
-- colon : character before a variable denotes that the information will be submitted by the user
INSERT INTO Authors (author_first_name, author_last_name) VALUES
(:author_first_name_input, :author_last_name_input);

-- get all books and their authors for the Books and their Authors page
SELECT book_author_id AS `Book-Author ID`, book_id AS `Book ID`, author_id AS `Author ID` FROM Books_Authors;

-- associate a book with an author (M:N addition)
-- colon : character before a variable denotes that the information will be submitted by the user
INSERT INTO Books_Authors (book_id, author_id) VALUES
(:book_id_from_dropdown_input, :author_id_from_dropdown_input);

-- disassociate a book from an author (M:N deletion)
-- colon : character before a variable denotes that the information will be submitted by the user
DELETE FROM Books_Authors WHERE
book_id = :book_id_from_dopdown_input AND
author_id = :author_id_from_dropdown_input;

-- change the author associated with a book to another author (M:N update)
-- colon : character before a variable denotes that the information will be submitted by the user
UPDATE Books_Authors
SET author_id = :author_id_from_dropdown_input WHERE
book_author_id = :book_author_id_from_dropdown_input;

-- get all library patrons for the Patrons page
SELECT patron_id AS `Patron ID`, patron_first_name AS `Patron First Name`, patron_last_name AS `Patron Last Name`, patron_phone_number AS `Patron Phone Number` FROM Patrons;
 
-- search for a patron by first and last name
-- colon : character before a variable denotes that the information will be submitted by the user
SELECT patron_id AS `Patron ID`, patron_first_name AS `Patron First Name`, patron_last_name AS `Patron Last Name`, patron_phone_number AS `Patron Phone Number` FROM Patrons WHERE
patron_first_name = :patron_first_name_from_input AND
patron_last_name = :patron_last_name_from_input;

-- add a new patron
-- colon : character before a variable denotes that the information will be submitted by the user
INSERT INTO Patrons (patron_first_name, patron_last_name, patron_phone_number) VALUES
(:patron_first_name_input, :patron_last_name_input, :patron_phone_number_input);

-- get all genres for the Genres page
SELECT genre_id AS `Genre ID`, genre_name AS `Genre Name`, genre_description AS `Genre Description` FROM Genres;

-- add a new genre
-- colon : character before a variable denotes that the information will be submitted by the user
INSERT INTO Genres (genre_name, genre_description) VALUES
(:genre_name_input, :genre_description_input);

-- get all publishers for the Publishers page
SELECT publisher_id AS `Publisher ID`, publisher_name AS `Publisher Name`, publisher_country AS `Publisher Country` FROM Publishers;
 
-- add a new publisher
-- colon : character before a variable denotes that the information will be submitted by the user
INSERT INTO Publishers (publisher_name, publisher_country) VALUES
(:publisher_name_input, :publisher_country_input);

-- get all genre IDs and genre names to populate the Genre dropdown
SELECT genre_id, genre_name FROM Genres;

-- get all publisher IDs and publisher names to populate the Publishers dropdown
SELECT publisher_id, publisher_name FROM Publishers;

-- get all patron IDs and patron first and last names to populate the Patrons dropdown
SELECT patron_id, patron_first_name, patron_last_name from Patrons;

-- get all book IDs and book title names to populate the Books dropdown
SELECT book_id, title_name FROM Books;

-- get all author IDs and author first and last names to populate the Authors dropdown
SELECT author_id, author_first_name, author_last_name FROM Authors;
