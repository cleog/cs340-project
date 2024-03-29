// Citation for the code in this file:
//     Code is copied from, adapted from, and based on:
//     Source Title: nodejs-starter-app
//     Author(s): gkochera (George Kochera), Cortona1, currym-osu (Dr. Michael Curry), dmgs11
//     Source Type: source code and information guide
//     Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
//     Date Accessed: 7/25/2022

// Get the objects we need to modify
let addBookForm = document.getElementById('add-book-ajax');

// Modify the objects we need
addBookForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTitleName = document.getElementById("input-title_name");
    let inputAuthorID = document.getElementById("input-author_id");
    let inputGenreID = document.getElementById("input-genre_id");
    let inputPublisherID = document.getElementById("input-publisher_id");
    let inputPatronID = document.getElementById("input-patron_id");
    let inputDueDate = document.getElementById("input-due_date");

    
    // Get the values from the form fields
    let titleNameValue = inputTitleName.value;
    let authorIDValue = inputAuthorID.value;
    let genreIDValue = inputGenreID.value;
    let publisherIDValue = inputPublisherID.value;
    let patronIDValue = inputPatronID.value;
    let dueDateValue = inputDueDate.value;

    // Validate user input
    if ((!titleNameValue) || (authorIDValue === '') || (genreIDValue === '') || (publisherIDValue === '') || (patronIDValue === ''))
    {
        alert("Title Name, Author, Genre, Publisher, and Patron ID are required fields.")
        return;
    } 

    if (dueDateValue === '' && patronIDValue !== 'None')
    {
        alert("If a patron's Patron ID is selected, then a Due Date must be specified. Otherwise, please select (None) for Patron ID and leave Due Date blank for a book that is not checked out.")
        return;
    }

    if (patronIDValue === 'None' && dueDateValue !== '')
    {
        alert("If a Due Date is specified, then a patron's Patron ID must be selected. Otherwise, please select (None) for Patron ID and leave Due Date blank for a book that is not checked out.")
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        title_name: titleNameValue,
        author_id: authorIDValue,
        genre_id: genreIDValue,
        publisher_id: publisherIDValue,
        patron_id: patronIDValue,
        due_date: dueDateValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputTitleName.value = '';
            inputAuthorID.value = '',
            inputGenreID.value = '';
            inputPublisherID.value = '';
            inputPatronID.value = '';
            inputDueDate.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from Books
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("books");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 7 cells
    let row = document.createElement("TR");
    let bookIDCell = document.createElement("TD");
    let titleNameCell = document.createElement("TD");
    let genreIDCell = document.createElement("TD");
    let publisherIDCell = document.createElement("TD");
    let patronIDCell = document.createElement("TD");
    let dueDateCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    bookIDCell.innerText = newRow.book_id;
    titleNameCell.innerText = newRow.title_name;
    genreIDCell.innerText = newRow.genre_id;
    publisherIDCell.innerText = newRow.publisher_id;
    patronIDCell.innerText = newRow.patron_id;
    dueDateCell.innerText = newRow.due_date;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteBook(newRow.book_id);
    };

    // Add the cells to the row 
    row.appendChild(bookIDCell);
    row.appendChild(titleNameCell);
    row.appendChild(genreIDCell);
    row.appendChild(publisherIDCell);
    row.appendChild(patronIDCell);
    row.appendChild(dueDateCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.book_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option,
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("input-book_id-update");
    let option = document.createElement("option");
    option.text = newRow.book_id + ': ' + newRow.title_name; 
    option.value = newRow.book_id; 
    selectMenu.add(option);
}
