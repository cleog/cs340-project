function deletePublisher(publisherID) {
    let link = '/delete-publisher-ajax/';
    let data = {
      id: publisherID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(publisherID);
      }
    });
  }
  
  function deleteRow(publisherID){
      let table = document.getElementById("publishers");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == publisherID) {
              table.deleteRow(i);
              break;
         }
      }
  }