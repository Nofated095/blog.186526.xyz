---
title: Cloudflare优化0->1
date: 2020-12-20 14:16:21
tags:
  - Cloudflare
  - Worker
  - node
  - Website
---

> ~~哪个男孩不想拥有一个贼快且使用Cloudflare的站点呢？~~

<!--more-->

## 降低请求用时

### 使用 `HTTP2`

> HTTP/2（超文本传输协议第 2 版，最初命名为 HTTP 2.0），简称为 h2（基于 TLS/1.2 或以上版本的加密连接）或 h2c（非加密连接），是 HTTP 协议的的第二个主要版本，使用于万维网。
> HTTP/2 是 HTTP 协议自 1999 年 HTTP 1.1 的改进版 RFC 2616 发布后的首个更新，主要基于 SPDY 协议。它由互联网工程任务组（IETF）的 Hypertext Transfer Protocol Bis（httpbis）工作小组进行开发。该组织于 2014 年 12 月将 HTTP/2 标准提议递交至 IESG 进行讨论，于 2015 年 2 月 17 日被批准。
> HTTP/2 标准于 2015 年 5 月以 RFC 7540 正式发表。HTTP/2 的标准化工作由 Chrome、Opera、Firefox、Internet Explorer 11、Safari、Amazon Silk 及 Edge 等浏览器提供支持。
> 多数主流浏览器已经在 2015 年底支持了该协议。此外，根据 W3Techs 的数据，截至 2019 年 6 月，全球有 36.5%的网站支持了 HTTP/2。
>
> 来自[维基百科](https://zh.wikipedia.org/wiki/HTTP/2)

`HTTP2` 相较于 `HTTP 1.1` 有许多特性，例如 `Server Push` `header压缩` `多路复用` 。

他们分别解决了 `HTTP 1.1` 的不同问题，尽可能提高了 `HTTP` 的性能。

#### `Server Push`

服务器将会把页面中内连资源推送至客户端，跟随 `HTML文件` 发送至客户端，避免了解析 `DOM` 再请求的延时。

需要注意的是，启用 `Server Push` 以后一定会存在流量浪费，因为服务端在接收到请求后一定会将额外的资源一并响应给客户端。如果客户端本地已有 `HTTP` 缓存，可以在接收到 `Push` 的帧后发送 `RST_STREAM` 帧阻止服务端发送后续的帧，但是头部的几个帧已经发送了，这是无可避免的。

##### 和内嵌`<style>` `<script>`相比优势

1. 客户端可以缓存 `Server Push` 资源
2. 可拒绝接受该资源
3. 成功缓存以后，其他页面可以不再请求这一文件

##### 如何启用 `Server Push`

1. 需要在  面板启用 `HTTP2`
2. 在需要 `Server Push` 的 `HTML` 文件发送时新增 `header` : `Link`
3. `Link` 需为 `HTML 5` 标准中 `<link rel="preload">` 的内容
   例如 `Link:</css/style.min.css>; rel=preload; as=style`

本站在使用 Cloudflare 作为 CDN 的情况下已启用 Server Push。

#### `Header压缩` & `多路复用`

##### `Header压缩`

`HPACK` 算法是新引入 `HTTP/2` 的一个算法，用于对 `HTTP` 头部做压缩。可大幅度降低 `Header` 的请求用时

##### `多路复用`

`HTTP2.0` 会将一个 `TCP` 连接分为若干个 流（Stream），每个 流 中可以传输若干 消息（Message），每个 消息 由若干最小的二进制 帧（Frame） 组成。
相比 `HTTP/1.1` 的单个 `TCP` 链接只能传输单一请求，`HTTP2` 加载可以加快 11.81% 到 47.7%

##### 如何启用

1. 在 `Cloudflare` 面板启用 `HTTP2`
2. Enjoy it

### 使用 `Cloudflare Partner` 来启用自选解析

使用 `Cloudflare Partner` 的自选解析可以有效的降低 `DNS` 请求用时,也可以对  的 `Anycast` 网络进行部分自定义

文章引路-> [关于 Cloudflare 自选节点的一些个人见解 | Puresys](https://www.puresys.net/3116.html)

## 降低回源用时

但是， 中国大陆方向的网络质量是我们无法控制的，因此如果要缩短网站响应耗时、减少 `TTFB（首字节时间）` ，就只能在  回源上做优化。

### 使用缓存规则

Cloudflare 为用户提供了完善的缓存配置功能，你可以通过 `Page Rules` 来详细的调整缓存规则

你可以在这里查询到有关 [`Caching`](https://support.cloudflare.com/hc/en-us/categories/200275248-Caching) 的内容

### 启用 [`brotli`](https://github.com/google/brotli) 压缩

> Brotli is a generic-purpose lossless compression algorithm that compresses data using a combination of a modern variant of the LZ77 algorithm, Huffman coding and 2nd order context modeling, with a compression ratio comparable to the best currently available general-purpose compression methods. It is similar in speed with deflate but offers more dense compression.
>
> -- 来自 [`google/brotil/README.md`](https://github.com/google/brotil)

`brotil` 是一个现代的压缩算法，已经被广泛用于网络的加速。相较于常用的 `gzip` 压缩算法 `brotil` 可以提高约10%-25%的压缩比。

你可以在 「 速度 - `Brotil` 」处应用 `Brotil` 加速。

### 将静态站点部署至 `Cloudflare Pages` or `Cloudflare Workers Sites`

PS: 鉴于 `Cloudflare Pages` 目前处于 `Beta Access` 阶段 请阅读 [Cloudflare Pages Docs](https://developers.cloudflare.com/pages) 详情

> `Cloudflare Worker` 提供了一个 `Serverless` 执行环境，使您无需配置或维护基础架构即可创建全新的应用程序或扩充现有的应用程序。
>
> --翻译自 [`Cloudflare Workers documentation/Welcome - Cloudflare Docs`](https://developers.cloudflare.com/workers/)

`Cloudflare Workers Sites` 是 `Cloudflare Workers` 的一个功能。将静态文件发布至 `KV Storage` , `Workers` 从 `KV` 中取回数据并发送给客户端，来达到静态站点部署的效果。

> KV Storage : `Cloudflare Workers KV` 是全球性的，低延迟的键值数据存储。

你可以在 [Cloudflare Docs](https://developers.cloudflare.com/workers/platform/sites/start-from-existing) 获得详细的部署教程。

## 前端性能优化

### 降低请求

在 `HTTP` 中，每一个请求都需要经过以下的阶段。

1. `Client` 链接至 `Server`
2. `Client` 发送请求
3. `Server` 接受、处理、返回请求
4. 释放该 `TCP` 请求

浏览器同时针对单个域名拥有并发限制，在 `Chrome` 中，同时只能对同一域名建立6个 `TCP` 链接。

你可以通过 [`Webpack`](https://webpack.js.org/) 等工具对 `css`、`js` 文件进行打包、合并、最小化。

#### 使用 `NoModule/Module` 构建

`ESM` 即 `ECMAScript modules`，是官方针对 `JavaScript` 的模块格式，在Chrome、Firefox及其他现代浏览器中，你可以通过 `<script type="module">` 来加载 `ESM` 代码。
由于 `ESM` 在现代浏览器（支持 `ES6+` 特性）中需要使用特殊的 `type`，你可以通过 `<script type="module">` 来判断浏览器对于 `ES6+` 的支持。
相对应的， `<script nomodule>` 不会在支持 `ES6+` 特性的浏览器上执行。

为了兼容性，大部分项目会编写 `ES6+` js代码，使用 `Babel` 、`Polyfill` 等工具将ES6+代码转换成 `ES5` 代码，以获取更好的兼容性，但是这样也同时会增加最后打包过后的代码大小，我们可以通过使用该方法来大幅度减小在现代浏览器上的加载大小，同时换取同等的兼容性。

你可以参考[「JDC | 京东设计中心 » 【译】如何在生产环境中部署ES2015+"」](https://jdc.jd.com/archives/4911)来尝试为项目部署 `Nomodule/Module` 支持。

#### 缩小组件粒度

在 `HTTP` 中， `Cache-Control` 作为缓存控制标头，可以管理数据的缓存状态。
我们可以通过缩小组件粒度的方法，做到 `Base` 和 `APP` 的代码进行分离，仅在第一次时请求 `Base` 代码，对其缓存，降低对 `Server` 的请求量。

你可以使用 `Webpack` 提供的 [代码分割](https://webpack.js.org/guides/code-splitting/) 对 `Base` 代码的分离。

#### 最小化 `HTML` `CSS` `JavaScript`

我们可以对这三种文件进行最小化操作，去除不必要的格式符、空白符、注释符，达到减小文件体积的效果。

你可以通过本地处理以及Cloudflare分发时同时压缩的方式来对文件进行处理。

对于本地处理，你可以使用 [`minify`](https://www.npmjs.com/package/minify) [`clean-css`](https://github.com/jakubpawlowicz/clean-css) [`HTMLMinifier`](https://www.npmjs.com/package/html-minifier)

对于Cloudflare，你可以在 「 速度 - 优化 - `Auto Minify` 」来配置 `js` 压缩。

### 预请求

对于大部分浏览器，你可以通过 `<link rel="prefetch">` 对请求进行预先加载。
如果是 `CSS` `JavaScript` `Image` 文件，你也可以使用 `<link rel="preload">` 对文件进行请求。
例如 `Google Fonts` 类的公共资源库，你也可以使用 `<link rel="preconnect">` 预先与该服务器进行链接。
当然，你可以使用 `<link rel="dns-prefetch">` 对该域名预先进行 `DNS` 解析。

#### 使用 [`Flying Pages`](https://github.com/gijo-varghese/flying-pages)

`Flying Pages` 是一个优秀的预加载工具，会对当前可视区域以及鼠标悬浮的区域中的链接进行预先请求。

你可以通过对 `Flying Pages` 文件的引用来使用其的功能。
例如:

``` html
<script>
window.FPConfig = {
  delay: 0,//浏览器空闲多少秒后开始预加载
  ignoreKeywords: [],//不进行预加载的链接，例 ["#", "/about"]
  maxRPS: 3,//每秒最大加载数
  hoverDelay: 50//鼠标悬浮后预加的延迟，毫秒单位
};
// 上方数值为默认值
</script>
<script defer src="https://cdn.jsdelivr.net/gh/gijo-varghese/flying-pages@2.1.2/flying-pages.min.js"></script>
```

本站使用 `Flying Pages` 对文件进行预先缓存。

#### 使用 Workbox 来改造客户端缓存

> `Workbox` 是一组库，可以为 `PWA` （渐进式网络应用） 的生产环境提供支持。
>
> --翻译自 [`Workbox  |  Google Developers`](https://developers.google.com/web/tools/workbox)

你可以使用 `Workbox` 对缓存进行完全的控制，并使用以下feature对网络进行管理。

- `预缓存`
- `运行环境缓存`
- `缓存策略`
- `请求旅游`
- `后台同步`
- `友好的调试信息`

你可以在此阅读 [`Workbox` 文档](https://developers.google.com/web/tools/workbox/reference-docs/latest)

本站已使用 `Workbox` 对缓存进行管理。

### 懒加载

#### 使用 `vanilla-lazyload`

#### 推迟不必要的 `CSS` `JS`

## 优化网络质量

### ~~备案 上带国内CDN的企业版~~

## 借物表

[天下武功，唯快不破 —— 我是这样优化博客的 | Sukka's Blog](https://blog.skk.moe/post/how-to-make-a-fast-blog/)
[关于 Cloudflare 自选节点的一些个人见解 | Puresys](https://www.puresys.net/3116.html)
