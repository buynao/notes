/**
 * @desc 获取页面大小
 * @desc 以及所有脚本产生的全局变量
 * @desc 并计算这些全局变量所占的字节大小
 * @desc copy当前所有代码，至chorme console黏贴查看
 * @author liufulong
 */
(function () {
    var app = {
        init: function () {
            var that = this;
            that.jsVars = [];
            that.createIframe();
            that.getJsVars();
            console.warn(that.jsVars);
            console.warn('页面脚本产生的全局变量一共', that.jsVars.length, '个');
        },
        getOldVars: function () {
            // 获取当前页面所有全局变量
            var oldVars = {};
            var key;
            for (key in window) {
                oldVars[key] = window[key];
            }
            return oldVars;
        },
        getJsVars: function () {
            // 获取当前页面脚本加载的全局变量，并添加至数组中
            var that = this;
            var ifrWindow;
            var oldVars;
            var key;
            var ifr = document.getElementById('ifr');
            that.winVars = {};
            ifrWindow = that.getIfrWindow();
            oldVars = that.getOldVars();
            if (ifrWindow) {
                for (key in oldVars) {
                    if (typeof ifrWindow[key] === 'undefined') {
                        that.jsVars.push(key);
                        that.winVars[key] = oldVars[key];
                    }
                }
            }
            console.warn(that.winVars);
            document.body.removeChild(ifr);
        },
        createIframe: function () {
            var iframe = document.createElement('iframe');
            iframe.src = 'about:blank';
            iframe.id = 'ifr';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        },
        getIfrWindow: function () {
            return document.getElementById('ifr')
            ? document.getElementById('ifr').contentWindow : null;
        },
        getHttp: function () {
            var result = [];
            if (!window.performance && !window.performance.getEntries) {
                return false;
            }
            window.performance.getEntries().forEach(function (perf) {
                result.push({
                    url: perf.name,
                    entryType: perf.entryType,
                    type: perf.initiatorType,
                    'duration(ms)': perf.duration
                });
            });
            console.table(result);
            return true;
        }
    };
    app.init();
})();