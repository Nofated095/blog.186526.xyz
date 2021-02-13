---
title: 或许是前端的新革新 —— 快速的改造一个pwa应用
date: 2021-02-13 13:37:18
tags: 
    - Web Worker
    - node
    - WebSite
    - PWA
thumbnail: https://cdn.jsdelivr.net/npm/real186pic@0.0.3/toc/pwa/pwa.svg
---
> 题图来自 [github:webmaxru/progressive-web-apps-logo](https://github.com/webmaxru/progressive-web-apps-logo) ,使用 [CC0](https://creativecommons.org/share-your-work/public-domain/cc0/) 对公众开放。

当然开发一个PWA不难。实际上，你可以通过改造，将现有的网站成为PWA。

<!--more-->

## 什么是PWA

`Progressive Web Apps` 即 `PWA` （渐进式网络应用），是一种使 `web app` 表现的像是 `native app` 的解决方案。
相较于其他方案，PWA具有以下优势：

1. 仅需要开发单个APP，无需多端开发。
2. 必要的文件可以被缓存到本地，会比正常的 `Web` 页面访问更快。
3. `PWA` 必须使用 `https` 链接。
4. `PWA` 可以离线工作。

### PWA是渐进的

正因为 `PWA` 是渐进的，你的 `APP` 仍然可以运行在不支持 `PWA` 的浏览器中。

本站已支持 `PWA`。

综合利弊，我觉得没有任何理由不把你的 `web app` 改造成 `PWA`。

## 改造PWA

`PWA` 的基本结构与旧的网站基本相似，你仍然可以使用你喜欢的工具开始。

我们这里使用一个最基本的 `HTML` 页面来进行演示，你可以在这里获得源码。

```html
<!DOCTYPE html>
<html>
    <head>
        <title>
            PWA Demo
        </title>
    </head>
    <body>
        <h1>Only a PWA demo</h1>
    </body>
</html>
```

### Web manifest

我们先从最简单的配置文件开始，`Web Manifest` 是一个 `JSON` 文件，规定了该 `PWA` 的各类信息，
例如名称，作者，版本，介绍，以及其他必要的信息。

这是一个最基本的 `Web Manifest` ,我们接下来会按项介绍。

```JSON
{
    "name":"PWADemo",
    "short_name":"PWADemo",
    "start_url":"./",
    "display":"standalone",
    "description":"A Simple App",
    "theme_color": "#fff",
    "icons":[
        {
            "src":"image.png",
            "sizes":"114514*1919810",
            "type": "image/png"
        }
    ]
}
```

#### `name`

该 `PWA` 的名称 , 例如在其他应用程序的列表中或作为图标的标签显示给用户。

#### `short_name`

该 `PWA` 简单、易读的名称，在没有足够空间时使用。

#### `shart_url`

用户启动时所加载的URL。

#### `display`

该 `PWA` 的首选显示方式，你可以在[这里](https://developer.mozilla.org/zh-CN/docs/Web/Manifest#display)获得可选项。

#### `description`

该 `PWA`的介绍。

#### `theme_color`

该 `PWA` 的默认主题颜色。

#### `icons`

指定可在各种环境中用作应用程序图标的图像对象数组。

每个图像对象可能包含以下值。

```JSON
{
    "size": "包含空格分隔的图像尺寸的字符串。",
    "src": "图像文件的路径。 如果src是一个相对URL，则基本URL将是manifest的URL。",
    "type": "图像的类型"
}
```

### 引入 PWA Manifest

在 `html` 中 `head` 引入以下 `tag`。

```html
<link rel="manifest" href="${webManifest.url}">
```

## `Service Worker`

如果说 `Web Manifest` 是 `PWA` 的定义，那么 `Service Worker` 就是 `PWA` 的心脏。

`Service Worker` 是一个运行于网页后部独立运行的脚本，可以拦截、修改请求，推送通知等。
它是一种 `Javascript Worker` ，因此无法访问 `DOM` ，可以通过 `postMessage` 接口向控制的页面发送信息。
`SW` 在不用时会被终止，并在下一次有需要时重启。
`SW` 应用了 `Promise`。

### 注册 `Service Worker`

`Service Worker` 独立于页面。因此，你需要先注册 `Service Worker`。

在该页面引入以下脚本来注册 `Service Worker`。

```js
// 当加载页面完成后再加载Service Worker
window.addEventListener("load", () => {
  // 判断是否允许或支持 serviceWorker
  if ("serviceWorker" in navigator) {
    // 注册 /sw.js 为 Service Worker，注册到 / 路径下
    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
      })
      // 当注册成功时显示当前注册路径
      .then((registration) =>
        console.info(
          `Service Worker registration successful with scope: ${registration.scope}`
        )
      )
      // 当注册失败时显示失败原因
      .catch((error) =>
        console.warn(`Service Worker registration failed: ${error}`)
      );
  }
});
```

由于在同一页面中，同时只能存在一个 `Service Worker`，所以我们需要考虑到 `Service Worker` 的更新情况。

你可以通过监听 `navigator.serviceWorker` 的 `controllerchange` 时间来更新 `Service Worker`。

```js
window.addEventListener("load", () => {
  // 判断是否允许或支持 serviceWorker
  if ("serviceWorker" in navigator) {
    //监听 controllerchange 时间，来更新 Service Worker
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      // 更新 Service Worker 要求当前页面进行刷新操作，可以通过对title的操作来引导用户更新。
      let d = document.querySelector("title");
      d.innerText = `Need Refresh - ${d.innerText}`;
    });
  }
});
```

### 编写 `Service Worker` 来处理缓存

我们这里使用 `Workbox` ，`Workbox` 是一个简单高效率的 `Service Worker` 处理库。
你可以在[这里](https://developers.google.com/web/tools/workbox)获得有关 `workbox` 的更多信息。

```js
// 导入 Workbox
importScripts(
    'https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.4/workbox/workbox-sw.js'
);

workbox.setConfig({
    modulePathPrefix: 'https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.4/workbox/'
});

const { core, precaching, routing, strategies, expiration, cacheableResponse, backgroundSync } = workbox;
const { CacheFirst, NetworkFirst, NetworkOnly, StaleWhileRevalidate } = strategies;
const { ExpirationPlugin } = expiration;
const { CacheableResponsePlugin } = cacheableResponse;

// 定义 Service Worker 版本

const cacheVersion = '-210213a';

// 清空其他版本缓存

self.addEventListener(
    // 当 Service Worker 被激活
    'activate',()=>{
        caches.keys().then(keys=>{
            return Promise.all(keys.map(key=>{
                // 删除不包含该版本号的所有缓存
                if(!key.includes(cacheVersion)) return caches.delete(key);
            }))
        });
    }
)

// 开始定义 Workbox

// 定义 workbox 基本信息

core.setCacheNameDetails({
    prefix: 'PWADemo',
    suffix: cacheVersion
});

// 清空其他版本信息

core.skipWaiting(); // 抢占 Service Worker 更新
core.clientsClaim();
precaching.cleanupOutdatedCaches(); // 清除预热的过期信息

// 开始编写缓存规则

/*
 * 缓存来自 jsdelivr 的资源
 * cdn.jsdelivr.net
 *
 * 使用 CacheFirst 模式，即缓存优先
 * 缓存时间: 30d
 */
routing.registerRoute(
    /.*cdn\.jsdelivr\.net/,
    new CacheFirst({
        fetchOptions: {
            // 启用CORS跨域
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                //设置缓存时间
                maxAgeSeconds: 30 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

/**
 * 
 *  缓存所有js css文件
 * 
 *  使用 staleWhileRevalidate 模式 （即优先使用缓存，在后台自动更新
 *  缓存名称 static-assets-cache
 * 
 */

routing.registerRoute(
    //匹配路径 可使用正则表达式
    /.*\.(css|js)/,
    new StaleWhileRevalidate(),
);

/**
 * 
 *  默认路由
 * 
 *  使用 NetworkFirst 网络优先模式，即有网络时网络优先，无网络时调用缓存
 * 
 */

routing.setDefaultHandler(
    new NetworkFirst(),
);
```
