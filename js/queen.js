var Queen = (function () {
  
  // 搜索间隔定时器
  var timer = null;
  // 棋盘大小
  var N = 8;
  // 搜索过程的堆栈
  var stack = [];
  // 上一个 OK 位置的列号
  var lastCol = 0;
  // 储存解的数组
  var result = [];
  // 是否正在运行
  var isRunning = false;
  // 配置参数
  // 搜索间隔
  var interval = 1000;
  var _f = function(){};
  // 每一步的回调
  var stepCallback = _f;
  // 找到解的回调
  var solutionCallback = _f;
  // 搜索结束的回调
  var doneCallback = _f;

  /**
   *
   * 判断位置是否 OK
   *
   * @param {Number} row 行号
   * @param {Number} col 列号
   * @returns {Boolean}
   * @private
   */
  function _isOK (row, col) {
    for (var i = 0; i < row; i++) {
      if (stack[i] === col || (Math.abs(stack[i] - col) === row - i)) {
        return false;
      }
    }
    return true;
  }

  /**
   * 
   * 搜索函数
   *
   * @returns {Boolean} 是否找到可用位置
   * @private
   */
  function _searchPosition () {

    // 每一步回调, 返回当前的放置堆栈
    stepCallback(stack);

    // 全部搜索完毕
    if (stack.length === 0) {
      _done();
      return false;
    }

    // 当前正进行搜索的行
    var currentRow = stack.length;

    // 循环去找
    for (var col = lastCol; col < N; col++) {

      // 找到了可以的位置
      if (_isOK(currentRow, col)) {

        // push 位置
        stack.push(col);

        // 满了，就是找到解了
        if (stack.length === N) {

          solutionCallback(stack.slice(0,N));

          // 储存结果
          result.push(stack.slice(0,N));

          // 弹出结果，从下一列继续找
          stack.pop();
          lastCol = col + 1;

        } else {

          // 没有满，则重置 lastCol，准备去找下一行
          lastCol = 0;

        }

        return true;
      }

    }

    // 这一行没有找到合适的位置，于是要回退上一行
    if (currentRow === 1 && ++stack[0] < N) {
      // 当准备回退到第 0 行时，而且第 0 行还有未搜索的列
      // 则把 0 行的列递增，把第 1 行要搜索的列置 0
      lastCol = 0;
    } else {
      // 回退上一行，从下一列继续搜索
      lastCol = stack.pop() + 1;    
    }

    return false;

  }

  /**
   * 搜索结束
   * @private
   */
  function _done () {
    clearInterval(timer);
    isRunning = false;
    doneCallback(result);
  }

  /**
   * 配置
   * @param options
   */
  function config (options) {
    interval = options.interval || interval;
    stepCallback = options.stepCallback || stepCallback;
    solutionCallback = options.solutionCallback || solutionCallback;
    doneCallback = options.doneCallback || doneCallback;
  }

  /**
   * 开始
   */
  function start () {
    if (isRunning) return;
    isRunning = true;
    result = [];
    stack = [];
    lastCol = 0;
    stack[0] = 0;
    timer = setInterval(_searchPosition, interval);
  }

  /**
   * 继续
   */
  function resume () {
    if (isRunning) return;
    isRunning = true;
    timer = setInterval(_searchPosition, interval);
  }

  /**
   * 停止
   */
  function stop () {
    isRunning = false;
    clearInterval(timer);
  }

  /**
   * 暂停
   */
  function pause () {
    isRunning = false;
    clearInterval(timer);
  }

  /**
   * 获取解数组
   * @returns {Array}
   */
  function getResult () {
    return result;
  }

  return {
    config: config,
    start: start,
    stop: stop,
    resume: resume,
    pause: pause,
    getResult: getResult
  };

})();