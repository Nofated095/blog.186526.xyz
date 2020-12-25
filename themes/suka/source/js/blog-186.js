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
    if ("serviceWorker" in navigator) { navigator.serviceWorker.register("/sw.js", { scope: "/" }).then((function (e) { })).catch((function (e) { })); let e = !1; navigator.serviceWorker.addEventListener("controllerchange", () => { e || (e = !0, alert("正在更新Service Worker……"), window.location.reload()) }) }
    if(!window.dataLayer) {
        let d=document,a = d.createElement("script");
        a.async = true;
        a.src="https://www.googletagmanager.com/gtag/js?id=G-ENYRL7T64N";
        d.head.appendChild(a);
    }
    {
        let d=document,url="/css/fonts.min.css";
        d.head.innerHTML += `<link rel="preload" href="${url}" as="style" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="${url}"></noscript>`;
    }
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
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
    if (window.valinedo) {
        valinedo();
    }
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-ENYRL7T64N');
};
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