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