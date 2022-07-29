function deleteGenre(genreID) {
    let link = '/delete-genre-ajax/';
    let data = {
      id: genreID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(genreID);
      }
    });
  }
  
  function deleteRow(genreID){
      let table = document.getElementById("genres");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == genreID) {
              table.deleteRow(i);
              break;
         }
      }
  }