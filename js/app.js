var App = (function () {

  /**
   *
   * 根据 id 生成棋盘表格
   *
   * @param {String} id 生产棋盘表格的 id
   * @returns {Element} 返回棋盘表格 DOM
   * @private
   */
  function _drawBoard (id) {
    var temp, i;
    // 生成 td 单元格
    var td = '<td><span></span></td>';
    for (i = 0, temp = ''; i < 8; i++) {
      temp += td;
    }
    // 生成 tr 行
    var tr = '<tr>' + temp + '</tr>';
    for (i = 0, temp = ''; i < 8; i++) {
      temp += tr;
    }
    // 拼出 tbody
    var tbody = '<tbody>' + temp + '</tbody>';

    // 创建表格
    var table = document.createElement('table');
    table.innerHTML = tbody;
    table.id = id;
    return table;
  }

  /**
   *
   * 置放皇后
   *
   * @param {String} tableId 棋盘表格 id
   * @param {Number} row 皇后位置行号
   * @param {Number} col 皇后位置列号
   * @private
   */
  function _placeQueen (tableId, row, col) {

    // 先清除
    _clearQueen(tableId, row);

    // 查找对应 td 添加 queen 类
    document.querySelector('#' + tableId + ' tr:nth-child(' + (row+1) + ') td:nth-child(' + (col+1) + ')').className = "queen";
  }

  /**
   *
   * 清除某行的皇后
   *
   * @param {String} tableId 棋盘表格 id
   * @param {Number} row 皇后位置行号
   * @private
   */
  function _clearQueen (tableId, row) {

    // 清除某行所有 td 的 queen 类
    Array.prototype.forEach.call(document.querySelectorAll('#' + tableId + ' tr:nth-child(' + (row+1) + ') td'), function (elem) {
      elem.className="";
    });
  }

  /**
   *
   * 根据数组来绘制皇后棋盘图, 数组 index 是行号, 数组 value 是列号
   *
   * @param {String} tableId 棋盘表格 id
   * @param {Array} stack 皇后数组
   * @private
   */
  function _drawQueens (tableId, stack) {

    // 需要整个棋盘重复绘制
    for (var i = 0; i < 8; i++) {
      if (typeof stack[i] !== 'undefined') {
        _placeQueen(tableId, i, stack[i]);
      } else {
        // 数组剩余没有皇后的位置就清除掉
        _clearQueen(tableId, i);
      }
    }

  }

  /**
   *
   * 配置皇后寻路间隔时间
   *
   * @private
   */
  function _configInterval () {
    var interval = document.getElementById('js-input-interval').value;
    interval = parseInt(interval) > 0 ? parseInt(interval) : 500;
    Queen.config({
      interval: interval
    });
  }

  /**
   *
   * 事件绑定
   *
   * @private
   */
  function _bind () {

    // 开始
    document.getElementById('js-btn-start').addEventListener('click', function (e) {
      e.preventDefault();
      _configInterval();
      // 清空结果
      document.getElementById('js-result').innerHTML = '';
      Queen.start();
    });

    // 停止
    document.getElementById('js-btn-stop').addEventListener('click', function (e) {
      e.preventDefault();
      Queen.stop();
    });

    // 继续
    document.getElementById('js-btn-resume').addEventListener('click', function (e) {
      e.preventDefault();
      _configInterval();
      Queen.resume();
    });

    // 暂停
    document.getElementById('js-btn-pause').addEventListener('click', function (e) {
      e.preventDefault();
      Queen.pause();
    });

  }


  /**
   *
   * 初始化
   *
   */
  function init () {

    // 初始绘制棋盘
    document.getElementById('js-board').appendChild(_drawBoard('table-board'));

    // 绑定事件
    _bind();

    // 配置皇后模块
    Queen.config({

      interval: 500,

      stepCallback: function (data) {
        // 每一步的绘制
        _drawQueens('table-board', data);
      },

      solutionCallback: function (data) {

        // 根据解的序号区分棋盘表格 id
        var tableId = 'table-result' + Queen.getResult().length;

        // 往结果区域添加解
        document.getElementById('js-result').appendChild(_drawBoard(tableId));
        _drawQueens(tableId, data);
      },

      doneCallback: function (data) {
        // 结束后弹出解的数目
        alert('found ' + data.length + ' solutions!');
      }
    });

  }


  return {
    init: init
  }

})();