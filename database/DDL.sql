-- Cleo Golds, Alvin Chan
-- CS 340 Group 15 - ACE
-- Project Title: Library Database System
-- Citation: Code is similar to code in Oregon State University CS340 explorations.
-- Data sourced from the books: 'Good Omens', 'The Difference Engine', 'The Silmarillion', 'The Sandman', and 'American Gods'.
 
-- Advice from Course to avoid conflicts while changing DB...
 
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;
 
--
-- STEP 1. CLEAN UP ANY EXISTING TABLES/DATA
--
DROP TABLE IF EXISTS Authors;
DROP TABLE IF EXISTS Books;
DROP TABLE IF EXISTS Genres;
DROP TABLE IF EXISTS Books_Authors;
DROP TABLE IF EXISTS Patrons;
DROP TABLE IF EXISTS Publishers;
 
 
--
-- Step 2. DEFINE ALL TABLES
--
 
--
-- Table structure for table Authors
--
 
CREATE TABLE Authors (
 author_id int NOT NULL AUTO_INCREMENT UNIQUE,
 author_first_name varchar(45) NOT NULL,
 author_last_name varchar(45) NOT NULL,
 PRIMARY KEY (author_id)
);

--
-- Table structure for table Genres
--
 
CREATE TABLE Genres (
 genre_id int NOT NULL AUTO_INCREMENT UNIQUE,
 genre_name varchar(45) NOT NULL UNIQUE,
 genre_description varchar(128) NOT NULL,
 PRIMARY KEY (genre_id)
);
 
--
-- Table structure for table Patrons
--
 
CREATE TABLE Patrons (
 patron_id int NOT NULL AUTO_INCREMENT UNIQUE,
 patron_first_name varchar(45) NOT NULL,
 patron_last_name varchar(45) NOT NULL,
 patron_phone_number varchar(45) NOT NULL,
 PRIMARY KEY (patron_id)
);
 
--
-- Table structure for table Publishers
--
 
CREATE TABLE Publishers (
 publisher_id int NOT NULL AUTO_INCREMENT UNIQUE,
 publisher_name varchar(255) NOT NULL UNIQUE,
 publisher_country varchar(45) NOT NULL,
 PRIMARY KEY (publisher_id)
);

--
-- Table structure for table Books
--
 
CREATE TABLE Books (
 book_id int NOT NULL AUTO_INCREMENT UNIQUE,
 publisher_id int NOT NULL,
 genre_id int NOT NULL,
 title_name varchar(128),
 due_date date,
 patron_id int,
 PRIMARY KEY (book_id),
 -- KEY fk_Books_Publishers_idx (publisher_id),
 -- KEY fk_Books_Genres_idx (genre_id),
 CONSTRAINT fk_Books_Genres FOREIGN KEY (genre_id) REFERENCES Genres (genre_id) ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT fk_Books_Publishers FOREIGN KEY (publisher_id) REFERENCES Publishers (publisher_id) ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT fk_Books_Patrons FOREIGN KEY (patron_id) REFERENCES Patrons (patron_id) ON DELETE SET NULL ON UPDATE CASCADE
);
 
--
-- Table structure for table Books_Authors
--
 
CREATE TABLE Books_Authors (
 book_author_id int NOT NULL AUTO_INCREMENT UNIQUE,
 book_id int NOT NULL,
 author_id int NOT NULL,
 PRIMARY KEY (book_author_id),
 -- KEY fk_Books_Authors_Authors_idx (author_id),
 -- KEY fk_Books_Authors_Books_idx (book_id),
 CONSTRAINT fk_Books_Authors_Authors FOREIGN KEY (author_id) REFERENCES Authors (author_id) ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT fk_Books_Authors_Books FOREIGN KEY (book_id) REFERENCES Books (book_id) ON DELETE CASCADE ON UPDATE CASCADE
);
 
--
-- Step 3. INSERT DATA
--
 
INSERT INTO Authors (author_first_name, author_last_name) VALUES
('Douglas', 'Adams'),   -- 1
('William','Gibson'),   -- 2
('Bruce','Sterling'),   -- 3
('Terry','Pratchett'),  -- 4
('J.R.R.', 'Tolkien'),  -- 5
('Neil','Gaiman');      -- 6
 
INSERT INTO Patrons (patron_first_name, patron_last_name, patron_phone_number) VALUES
('Cleo', 'Golds', '425-123-1111'),    -- 1
('Alvin', 'Chan', '425-234-2222'),    -- 2
('Ashley', 'Smith', '206-111-2131'),  -- 3
('Max', 'Legroom', '206-716-1291');   -- 4
 
INSERT INTO Genres (genre_name, genre_description) VALUES
('Science Fiction', 'Content that deals with imaginative, futuristic technology'),  -- 1
('Fantasy','Content that has magical elements'),       -- 2
('Steampunk', 'Content that has imaginative technology based on technology from the Industrial Revolution'); -- 3

INSERT INTO Publishers (publisher_name, publisher_country) VALUES
('HarperCollins', 'USA'), -- 1
('Gollancz', 'UK'),  -- 2
('DelRey', 'USA'),    -- 3
('DC Comics', 'USA'), -- 4
('William Morrow Paperbacks', 'USA'); -- 5
 
INSERT INTO Books (title_name, genre_id, publisher_id, patron_id, due_date) VALUES
('Good Omens', (SELECT genre_id from Genres where genre_name='Fantasy'), 
(SELECT publisher_id from Publishers where publisher_name='HarperCollins'), 
(SELECT patron_id from Patrons where Patrons.patron_id=1), '2022-07-28'),

('The Difference Engine', (SELECT genre_id from Genres where genre_name='Steampunk'),
(SELECT publisher_id from Publishers where publisher_name='Gollancz'), NULL, NULL),

('The Silmarillion', (SELECT genre_id from Genres where genre_name='Fantasy'), 
(SELECT publisher_id from Publishers where publisher_name='DelRey'), NULL, NULL),

('The Sandman', (SELECT genre_id from Genres where genre_name='Fantasy'), 
(SELECT publisher_id from Publishers where publisher_name='DC Comics'), NULL, NULL),

('American Gods', (SELECT genre_id from Genres where genre_name='Fantasy'), 
(SELECT publisher_id from Publishers where publisher_name='William Morrow Paperbacks'), NULL, NULL);


INSERT INTO Books_Authors (book_id, author_id) 
VALUES ((SELECT book_id from Books where Books.book_id=1), 
(SELECT author_id from Authors where Authors.author_id=4)
), ((SELECT book_id from Books where Books.book_id=1), 
(SELECT author_id from Authors where Authors.author_id=6)
), ((SELECT book_id from Books where Books.book_id=2), 
(SELECT author_id from Authors where Authors.author_id=2)
), ((SELECT book_id from Books where Books.book_id=2), 
(SELECT author_id from Authors where Authors.author_id=3)
), ((SELECT book_id from Books where Books.book_id=3), 
(SELECT author_id from Authors where Authors.author_id=5)
), ((SELECT book_id from Books where Books.book_id=4), 
(SELECT author_id from Authors where Authors.author_id=6)
), ((SELECT book_id from Books where Books.book_id=5), 
(SELECT author_id from Authors where Authors.author_id=6)
);

 
-- /*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
 
-- per advice from course assignment...
SET FOREIGN_KEY_CHECKS=1;
COMMIT;