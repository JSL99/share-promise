// 简单的ajax展示下回调地狱
var url1 = 'http://www.baidu.com';
// 第1个请求
var XHR1 = new XMLHttpRequest();
XHR1.open('GET', url, true);
XHR1.send();

XHR1.onreadystatechange = function() {
    if (XHR.readyState === 4 && XHR.status === 200) {
        result = XHR.response;
        // 第2个请求
        var XHR2 = new XMLHttpRequest();
        XHR2.open('GET', url, true);
        XHR2.send();

        XHR2.onreadystatechange = function() {
            if (XHR.readyState === 4 && XHR.status === 200) {
              // 第3个请求
              var XHR3 = new XMLHttpRequest();
              XHR3.open('GET', url, true);
              XHR3.send();

              XHR3.onreadystatechange = function() {
                  if (XHR.readyState === 4 && XHR.status === 200) {
                    // ....
                  }
              }
            }
        }
    }
}