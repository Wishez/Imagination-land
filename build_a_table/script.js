function buildTable(data) {
      var table = document.createElement('table'),
          captions = buildCaptions(Object.keys(data[0])),
          rows = buildRows(data),
          thead = document.createElement('thead'),
          tbody = document.createElement('tbody');
        
      thead.appendChild(captions);
      
      rows.forEach(function(row) {
      tbody.appendChild(row);      
      });
      
      table.appendChild(thead);
      table.appendChild(tbody);
      
      return table;
    }

    function buildCaptions(arr) {
      var row = document.createElement('tr');
    
      arr.forEach(function(e, i) {
        var th = document.createElement('th'),
            text = document.createTextNode(e);
      
        row.appendChild(th).appendChild(text);
      });
    
      return row;
    }

    function buildRows(dataArr) {
      var rows = [];
    
      dataArr.forEach(function(dataObj) {
        var row = document.createElement('tr');
      
        for (var prop in dataObj) {
          var td = document.createElement('td'),
              text = document.createTextNode(dataObj[prop]);
          if (prop === 'height')
            td.style.textAlign = 'right';
          
          row.appendChild(td).appendChild(text);
        }
        
        rows.push(row);
      });
   
      return rows; 
    }
    // console.log(buildTable(MOUNTAINS));
   document.querySelector('wrapper').appendChild(buildTable(MOUNTAINS));