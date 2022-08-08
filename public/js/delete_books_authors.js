// Citation for the code in this file:
//     Code is copied from, adapted from, and based on:
//     Source Title: nodejs-starter-app
//     Author(s): gkochera (George Kochera), Cortona1, currym-osu (Dr. Michael Curry), dmgs11
//     Source Type: source code and information guide
//     Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
//     Date Accessed: 7/25/2022

function deleteBooksAuthors(book_author_id) {
    // Put our data we want to send in a javascript object
    let data = {
        book_author_id: book_author_id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-books-authors-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(book_author_id);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(book_author_id){

    let table = document.getElementById("books-authors-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == book_author_id) {
            table.deleteRow(i);
            deleteDropDownMenu(book_author_id);
            break;
       }
    }
}

function deleteDropDownMenu(book_author_id){
    let selectMenu = document.getElementById("input-book-author-id-update");
    for (let i = 0; i < selectMenu.length; i++){
        if (Number(selectMenu.options[i].value) === Number(book_author_id)){
            selectMenu[i].remove();
            break;
        } 
  
    }
}