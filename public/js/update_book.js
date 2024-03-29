// Citation for the code in this file:
//     Code is copied from, adapted from, and based on:
//     Source Title: nodejs-starter-app
//     Author(s): gkochera (George Kochera), Cortona1, currym-osu (Dr. Michael Curry), dmgs11
//     Source Type: source code and information guide
//     Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
//     Date Accessed: 7/25/2022

// Get the objects we need to modify
let updateBookForm = document.getElementById('update-book-form-ajax');

// Modify the objects we need
updateBookForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBookID = document.getElementById("input-book_id-update");
    let inputPatronID = document.getElementById("input-patron_id-update");
    let inputDueDate = document.getElementById("input-due_date-update");

    // Get the values from the form fields
    let bookIDValue = inputBookID.value;
    let patronIDValue = inputPatronID.value;
    let dueDateValue = inputDueDate.value;
    
    // Validate user input 
    if ((bookIDValue === '') || (patronIDValue === ''))
    {
        alert("Book ID and Patron ID are required fields.")
        return;
    }

    if (dueDateValue === '' && patronIDValue !== 'None' || patronIDValue === 'None' && dueDateValue !== '')
    {
        alert("To return a book, select (None) for Patron ID and leave Due Date blank. To check out a book, select the patron's Patron ID and specify a Due Date.")
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        book_id: bookIDValue,
        patron_id: patronIDValue,
        due_date: dueDateValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, bookIDValue);

            // Clear the input fields for another transaction
            inputBookID.value = '';
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


function updateRow(data, bookID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("books");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == bookID) {

            // Get the location of the row where we found the matching Book ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of patron_id value
            let td = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign patron_id to our value we updated to
            td.innerHTML = parsedData[0].patron_id; 

            // Get td of due_date value
            let td_date = updateRowIndex.getElementsByTagName("td")[5];

            // Reassign due_date to our value we updated to
            td_date.innerHTML = parsedData[0].due_date; 

        }
    }
}