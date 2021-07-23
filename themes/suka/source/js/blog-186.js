(function () {
    if (typeof globalThis === 'undefined') {
      var globalThis = window;
    }
  
    console.log('\n %c 186526\'s Blog | © 186526 \n', 'color: #fff; background: #444; padding:5px 0;');
    window.addEventListener("load", function () {
      whenAvailable("Pjax", function () {
        var pjax = new Pjax({
          elements: "a:not([target=_blank])",
          selectors: ["title", "meta[name=description]", ".pjax"],
          cacheBust: !1
        });
      });
      document.addEventListener("pjax:send", send);
      document.addEventListener("pjax:success", suc);
    });
    window.addEventListener('load', function () {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        }).then(function (registration) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function (err) {
          console.warn('ServiceWorker registration failed: ', err);
        });
        navigator.serviceWorker.addEventListener('controllerchange', function () {
          var d = document.querySelector("title");
          d.innerText = "Need update Service Worker - " + d.innerText; //d=document.body;
          //d.innerHTML = `<div class="toast toast-primary">Service Worker已经更新 请刷新页面进行安装</div>` + d.innerHTML;
        });
      }
  
      if (/HeadlessChrome/.test(window.navigator.userAgent)) {
        return;
      }
  
      (function(e,t,n,i,s,a,c){e[n]=e[n]||function(){(e[n].q=e[n].q||[]).push(arguments)}
      ;a=t.createElement(i);c=t.getElementsByTagName(i)[0];a.async=true;a.src=s
      ;c.parentNode.insertBefore(a,c)
      })(window,document,"galite","script","https://cdn.jsdelivr.net/npm/ga-lite@2/dist/ga-lite.min.js");

      galite('create', 'UA-174554903-1', 'auto');
      galite('send', 'pageview');
  
      if (typeof navigator.connection !== "undefined") {
        if (navigator.connection.rtt <= 600 & navigator.connection.downlink >= 0.5) {
          fontsInit();
        } else {
          setTimeout(fontsInit, 5000);
        }
      } else {
        setTimeout(fontsInit, 1000);
      }
  
    });
  
    var fontsInit = function fontsInit() {
      var d = document,
          url = "/css/fonts.min.css";
      d.head.innerHTML += "<link rel=\"preload\" href=\"".concat(url, "\" as=\"style\" onload=\"this.onload=null;this.rel='stylesheet'\"><noscript><link rel=\"stylesheet\" href=\"").concat(url, "\"></noscript>");
    };
  
    var send = function send() {
      whenAvailable("NProgress", function () {
        NProgress.inc();
      });
    };
  
    var suc = function suc() {
      whenAvailable("NProgress", function () {
        NProgress.done();
      });
      whenAvailable("LazyLoad", function () {
        new LazyLoad(globalThis.lazyLoadOptions);
      });
    };
    window.addEventListener('unload', function() {
      galite('send', 'timing', 'JS Dependencies', 'unload')
    })
  
    document.addEventListener('LoadValine', function () {
      if (document.querySelector("#vcomments")) {
        valinedo();
      }
    });
  
    globalThis.whenAvailable = function (name, callback) {
      var interval = 100;
      window.setTimeout(function () {
        if (window[name]) {
          callback(window[name]);
        } else {
          window.setTimeout(arguments.callee, interval);
        }
      }, interval);
    };
  
    globalThis.__BLOG__ = function () {
      return new Object({
        name: "186526's Blog",
        use: "hexo@^5.0"
      });
    }();
  })();