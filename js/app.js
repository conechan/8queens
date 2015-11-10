var App = (function () {

  function _drawBoard (id) {
    var temp, i;
    var td = '<td><span></span></td>';
    for (i = 0, temp = ''; i < 8; i++) {
      temp += td;
    }
    var tr = '<tr>' + temp + '</tr>';
    for (i = 0, temp = ''; i < 8; i++) {
      temp += tr;
    }
    var tbody = '<tbody>' + temp + '</tbody>';

    var table = document.createElement('table');
    table.innerHTML = tbody;
    table.id = id;
    return table;
  }

  function _placeQueen (tableId, row, col) {

    _clearQueen(tableId, row);
    document.querySelector('#' + tableId + ' tr:nth-child(' + (row+1) + ') td:nth-child(' + (col+1) + ')').className = "queen";
  }

  function _clearQueen (tableId, row) {
    Array.prototype.forEach.call(document.querySelectorAll('#' + tableId + ' tr:nth-child(' + (row+1) + ') td'), function (elem) {
      elem.className="";
    });
  }

  function _drawQueens (tableId, stack) {

    for (var i = 0; i < 8; i++) {
      if (typeof stack[i] !== 'undefined') {
        _placeQueen(tableId, i, stack[i]);
      } else {
        _clearQueen(tableId, i);
      }
    }

  }

  function _bind () {



    document.getElementById('js-btn-start').addEventListener('click', function (e) {
      e.preventDefault();
      var interval = document.getElementById('js-input-interval').value;
      interval = parseInt(interval) > 0 ? parseInt(interval) : 500;
      document.getElementById('js-result').innerHTML = '';
      Queen.config({
        interval: interval
      });
      Queen.start();
    });

    document.getElementById('js-btn-stop').addEventListener('click', function (e) {
      e.preventDefault();
      Queen.stop();
    });

    document.getElementById('js-btn-resume').addEventListener('click', function (e) {
      e.preventDefault();
      var interval = document.getElementById('js-input-interval').value;
      interval = parseInt(interval) > 0 ? parseInt(interval) : 500;
      Queen.config({
        interval: interval
      });
      Queen.resume();
    });

    document.getElementById('js-btn-pause').addEventListener('click', function (e) {
      e.preventDefault();
      Queen.pause();
    });

  }


  function init () {

    document.getElementById('js-board').appendChild(_drawBoard('table-board'));

    _bind();

    Queen.config({
      interval: 500,
      stepCallback: function (data) {
        _drawQueens('table-board', data);
      },
      solutionCallback: function (data) {

        var tableId = 'table-result' + Queen.getResult().length;

        document.getElementById('js-result').appendChild(_drawBoard(tableId));
        _drawQueens(tableId, data);
      },
      doneCallback: function (data) {
        _drawQueens('table-board', []);
        alert('found ' + Queen.getResult().length + ' solutions!');
      }
    });

  }


  return {
    init: init
  }

})();