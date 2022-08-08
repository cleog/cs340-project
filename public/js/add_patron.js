// Citation for the code in this file:
//     Code is copied from, adapted from, and based on:
//     Source Title: nodejs-starter-app
//     Author(s): gkochera (George Kochera), Cortona1, currym-osu (Dr. Michael Curry), dmgs11
//     Source Type: source code and information guide
//     Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
//     Date Accessed: 7/25/2022

// Get the objects we need to modify
let addPatronForm = document.getElementById('add-patron-ajax');

// Modify the objects we need
addPatronForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPatronFirstName = document.getElementById("input-patron_first_name");
    let inputPatronLastName = document.getElementById("input-patron_last_name");
    let inputPatronPhoneNumber = document.getElementById("input-patron_phone_number");

    // Get the values from the form fields
    let patronFirstNameValue = inputPatronFirstName.value;
    let patronLastNameValue = inputPatronLastName.value;
    let patronPhoneNumberValue = inputPatronPhoneNumber.value;

    // Validate user input
    if (!patronFirstNameValue || !patronLastNameValue || !patronPhoneNumberValue)
    {
        alert("Patron First Name, Patron Last Name, and Patron Phone Number are required fields.")
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        patron_first_name: patronFirstNameValue,
        patron_last_name: patronLastNameValue,
        patron_phone_number: patronPhoneNumberValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-patron-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputPatronFirstName.value = '';
            inputPatronLastName.value = '';
            inputPatronPhoneNumber.value = '';
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
    let currentTable = document.getElementById("patrons");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 5 cells
    let row = document.createElement("TR");
    let patronIDCell = document.createElement("TD");
    let patronFirstNameCell = document.createElement("TD");
    let patronLastNameCell = document.createElement("TD");
    let patronPhoneNumberCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");


    // Fill the cells with correct data
    patronIDCell.innerText = newRow.patron_id;
    patronFirstNameCell.innerText = newRow.patron_first_name;
    patronLastNameCell.innerText = newRow.patron_last_name;
    patronPhoneNumberCell.innerText = newRow.patron_phone_number;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePatron(newRow.patron_id);
    };

    // Add the cells to the row 
    row.appendChild(patronIDCell);
    row.appendChild(patronFirstNameCell);
    row.appendChild(patronLastNameCell);
    row.appendChild(patronPhoneNumberCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.patron_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

}
