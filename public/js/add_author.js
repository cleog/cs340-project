// Citation for the code in this file:
//     Code is copied from, adapted from, and based on:
//     Source Title: nodejs-starter-app
//     Author(s): gkochera (George Kochera), Cortona1, currym-osu (Dr. Michael Curry), dmgs11
//     Source Type: source code and information guide
//     Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
//     Date Accessed: 7/25/2022

// Get the objects we need to modify
let addAuthorForm = document.getElementById('add-author-ajax');

// Modify the objects we need
addAuthorForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputAuthorFirstName = document.getElementById("input-author_first_name");
    let inputAuthorLastName = document.getElementById("input-author_last_name");

    // Get the values from the form fields
    let authorFirstNameValue = inputAuthorFirstName.value;
    let authorLastNameValue = inputAuthorLastName.value;

    // Validate user input
    if (!authorFirstNameValue || !authorLastNameValue)
    {
        alert("Author First Name and Author Last Name are required fields.")
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        author_first_name: authorFirstNameValue,
        author_last_name: authorLastNameValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-author-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputAuthorFirstName.value = '';
            inputAuthorLastName.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("authors");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let authorIDCell = document.createElement("TD");
    let authorFirstNameCell = document.createElement("TD");
    let authorLastNameCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");


    // Fill the cells with correct data
    authorIDCell.innerText = newRow.author_id;
    authorFirstNameCell.innerText = newRow.author_first_name;
    authorLastNameCell.innerText = newRow.author_last_name;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteAuthor(newRow.author_id);
    };

    // Add the cells to the row 
    row.appendChild(authorIDCell);
    row.appendChild(authorFirstNameCell);
    row.appendChild(authorLastNameCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.author_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

}
