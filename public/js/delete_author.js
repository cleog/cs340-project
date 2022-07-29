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
         if (table.rows[i].getAttribute("data-value") == authorID) {
              table.deleteRow(i);
              break;
         }
      }
  }