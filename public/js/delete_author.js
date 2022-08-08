// Citation for the code in this file:
//     Code is copied from, adapted from, and based on:
//     Source Title: nodejs-starter-app
//     Author(s): gkochera (George Kochera), Cortona1, currym-osu (Dr. Michael Curry), dmgs11
//     Source Type: source code and information guide
//     Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
//     Date Accessed: 7/25/2022

function deleteAuthor(authorID) {
    let link = '/delete-author-ajax/';
    let data = {
      id: authorID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(authorID);
      }
    });
  }
  
  function deleteRow(authorID){
      let table = document.getElementById("authors");
      for (let i = 0, row; row = table.rows[i]; i++) {
          //iterate through rows
          //rows would be accessed using the "row" variable assigned in the for loop
          if (table.rows[i].getAttribute("data-value") == authorID) {
              table.deleteRow(i);
              break;
         }
      }
  }