function deletePatron(patronID) {
    let link = '/delete-patron-ajax/';
    let data = {
      id: patronID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(patronID);
      }
    });
  }
  
  function deleteRow(patronID){
      let table = document.getElementById("patrons");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == patronID) {
              table.deleteRow(i);
              break;
         }
      }
  }