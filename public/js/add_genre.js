// Citation for the code in this file:
//     Code is copied from, adapted from, and based on:
//     Source Title: nodejs-starter-app
//     Author(s): gkochera (George Kochera), Cortona1, currym-osu (Dr. Michael Curry), dmgs11
//     Source Type: source code and information guide
//     Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
//     Date Accessed: 7/25/2022

// Get the objects we need to modify
let addGenreForm = document.getElementById('add-genre-ajax');

// Modify the objects we need
addGenreForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputGenreName = document.getElementById("input-genre_name");
    let inputGenreDescription = document.getElementById("input-genre_description");

    // Get the values from the form fields
    let genreNameValue = inputGenreName.value;
    let genreDescriptionValue = inputGenreDescription.value;

    // Data Validation
    if (!genreNameValue)
    {
        alert("Genre Name not entered")
        return;
    }

    if (!genreDescriptionValue)
    {
        alert("Genre Description not entered")
        return;
    }

    // Put our data we want to send in a javascript object
    // having this as data may cause an issue?
    let data = {
        genre_name: genreNameValue,
        genre_description: genreDescriptionValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-genre-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputGenreName.value = '';
            inputGenreDescription.value = '';
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
    let currentTable = document.getElementById("genres");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
    

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let genreIDCell = document.createElement("TD");
    let genreNameCell = document.createElement("TD");
    let genreDescriptionCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");


    // Fill the cells with correct data
    genreIDCell.innerText = newRow.genre_id;
    genreNameCell.innerText = newRow.genre_name;
    genreDescriptionCell.innerText = newRow.genre_description;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteGenre(newRow.genre_id);
    };

    // Add the cells to the row 
    row.appendChild(genreIDCell);
    row.appendChild(genreNameCell);
    row.appendChild(genreDescriptionCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.genre_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

}