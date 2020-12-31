console.log('\n %c 186526\'s Blog | © 186526 \n', 'color: #fff; background: #444; padding:5px 0;');
window.addEventListener("load", () => {
    whenAvailable("Pjax", () => {
        const pjax = new Pjax({
            elements: "a:not([target=_blank])",
            selectors: [
                "title",
                "meta[name=description]",
                ".pjax",
            ],
            cacheBust: !1
        });
    });
    document.addEventListener("pjax:send", send);
    document.addEventListener("pjax:success", suc);
});
window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/sw.js', {
                scope: '/',
            })
            .then(function (registration) {
                console.log(
                    'ServiceWorker registration successful with scope: ',
                    registration.scope,
                );
            })
            .catch(function (err) {
                console.warn('ServiceWorker registration failed: ', err);
            });
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            let d = document.querySelector("title");
            d.innerText = "Refresh to update Service Worker - " + d.innerText;
            //d=document.body;
            //d.innerHTML = `<div class="toast toast-primary">Service Worker已经更新 请刷新页面进行安装</div>` + d.innerHTML;
        });
    }
    if (/HeadlessChrome/.test(window.navigator.userAgent)) { return; }
    if (!window.dataLayer) {
        let d = document, a = d.createElement("script");
        a.async = true;
        a.src = "https://www.googletagmanager.com/gtag/js?id=G-ENYRL7T64N";
        d.head.appendChild(a);
    }
    if (navigator.connection.rtt <= 350 & navigator.connection.downlink >= 1) {
        let d = document, url = "/css/fonts.min.css";
        d.head.innerHTML += `<link rel="preload" href="${url}" as="style" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="${url}"></noscript>`;
    }
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-ENYRL7T64N');
});
let send = () => {
    whenAvailable("NProgress", () => {
        NProgress.inc();
    });
};
let suc = () => {
    whenAvailable("NProgress", () => {
        NProgress.done();
    });
    whenAvailable("LazyLoad", () => {
        new LazyLoad();
    });
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-ENYRL7T64N');
};
document.addEventListener('LoadValine',()=>{
    if(document.querySelector("#vcomments")){
        valinedo();
    }
});
let whenAvailable = (name, callback) => {
    var interval = 100;
    window.setTimeout(function () {
        if (window[name]) {
            callback(window[name]);
        } else {
            window.setTimeout(arguments.callee, interval);
        }
    }, interval);
}