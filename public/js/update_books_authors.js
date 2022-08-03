// Citation for the code in this file:
//     Code is copied from, adapted from, and based on:
//     Source Title: nodejs-starter-app
//     Author(s): gkochera (George Kochera), Cortona1, currym-osu (Dr. Michael Curry), dmgs11
//     Source Type: source code and information guide
//     Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
//     Date Accessed: 7/25/2022

// Get the objects we need to modify
let updateBooksAuthorsForm = document.getElementById('update-books-authors-form-ajax');

// Modify the objects we need
updateBooksAuthorsForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBookAuthorID = document.getElementById("input-book-author-id-update");
    let inputAuthorID = document.getElementById("input-author-id-update");

    // Get the values from the form fields
    let bookAuthorIDValue = inputBookAuthorID.value;
    let authorIDValue = inputAuthorID.value;
    
    // Data Validation

    if (isNaN(authorIDValue)) 
    {
        alert("Author ID not selected")
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        book_author_id: bookAuthorIDValue,
        author_id: authorIDValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-books-authors-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, bookAuthorIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, bookAuthorID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("books-authors-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == bookAuthorID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].author_id; 
       }
    }
}