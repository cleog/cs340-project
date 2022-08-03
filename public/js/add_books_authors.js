// Citation for the code in this file:
//     Code is copied from, adapted from, and based on:
//     Source Title: nodejs-starter-app
//     Author(s): gkochera (George Kochera), Cortona1, currym-osu (Dr. Michael Curry), dmgs11
//     Source Type: source code and information guide
//     Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
//     Date Accessed: 7/25/2022

// Get the objects we need to modify
let addBooksAuthorsForm = document.getElementById('add-books-authors-form-ajax');

// Modify the objects we need
addBooksAuthorsForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBookID = document.getElementById("input-book-id");
    let inputAuthorID = document.getElementById("input-author-id");

    // Get the values from the form fields
    let bookIDValue = inputBookID.value;
    let authorIDValue = inputAuthorID.value;

    // Data Validation 
    if (!bookIDValue && !authorIDValue)
    {
        alert("Book ID and Genre ID not entered")
        return;
    }
    if (!bookIDValue)
    {
        alert("Book ID not entered")
        return;
    }
    if (!authorIDValue)
    {
        alert("Author ID not entered")
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        book_id: bookIDValue,
        author_id: authorIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-books-authors-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputBookID.value = '';
            inputAuthorID.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("books-authors-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let bookAuthorIDCell = document.createElement("TD");
    let bookIDCell = document.createElement("TD");
    let authorIDCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    bookAuthorIDCell.innerText = newRow.book_author_id;
    bookIDCell.innerText = newRow.book_id;
    authorIDCell.innerText = newRow.author_id;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteBooksAuthors(newRow.book_author_id);
    };

    // Add the cells to the row 
    row.appendChild(bookAuthorIDCell);
    row.appendChild(bookIDCell);
    row.appendChild(authorIDCell);
    row.appendChild(deleteCell);
    
    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.book_author_id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("input-book-author-id-update");
    let option = document.createElement("option");
    option.text = newRow.book_author_id;
    option.value = newRow.book_author_id;
    selectMenu.add(option);
    // End of new step 8 code.
}