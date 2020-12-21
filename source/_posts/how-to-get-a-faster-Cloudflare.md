---
title: Cloudflare优化0->1
date: 2020-12-20 14:16:21
tags:
  - Cloudflare
  - Worker
  - node
  - Website
---

> ~~哪个男孩不想拥有一个贼快且使用 Cloudflare 的站点呢？~~

<!--more-->

## 降低请求用时

### 使用 `HTTP2`

> HTTP/2（超文本传输协议第 2 版，最初命名为 HTTP 2.0），简称为 h2（基于 TLS/1.2 或以上版本的加密连接）或 h2c（非加密连接），是 HTTP 协议的的第二个主要版本，使用于万维网。
> HTTP/2 是 HTTP 协议自 1999 年 HTTP 1.1 的改进版 RFC 2616 发布后的首个更新，主要基于 SPDY 协议。它由互联网工程任务组（IETF）的 Hypertext Transfer Protocol Bis（httpbis）工作小组进行开发。该组织于 2014 年 12 月将 HTTP/2 标准提议递交至 IESG 进行讨论，于 2015 年 2 月 17 日被批准。
> HTTP/2 标准于 2015 年 5 月以 RFC 7540 正式发表。HTTP/2 的标准化工作由 Chrome、Opera、Firefox、Internet Explorer 11、Safari、Amazon Silk 及 Edge 等浏览器提供支持。
> 多数主流浏览器已经在 2015 年底支持了该协议。此外，根据 W3Techs 的数据，截至 2019 年 6 月，全球有 36.5%的网站支持了 HTTP/2。
>
> 来自[维基百科](https://zh.wikipedia.org/wiki/HTTP/2)

`HTTP2` 相较于 `HTTP 1.1` 有许多特性 例如 `Server Push` `header压缩` `多路复用` 

他们分别解决了 `HTTP 1.1` 的不同问题 尽可能提高了 `HTTP` 的性能

#### `Server Push`

服务器将会把页面中内连资源推送至客户端 跟随 `HTML文件` 发送至客户端 避免了解析 `DOM` 再请求的延时

需要注意的是，启用 `Server Push` 以后一定会存在流量浪费，因为服务端在接收到请求后一定会将额外的资源一并响应给客户端。如果客户端本地已有 `HTTP` 缓存，可以在接收到 `Push` 的帧后发送 `RST_STREAM` 帧阻止服务端发送后续的帧，但是头部的几个帧已经发送了，这是无可避免的。

##### 和内嵌`<style>` `<script>`相比优势

1. 客户端可以缓存 `Server Push` 资源
2. 可拒绝接受该资源
3. 成功缓存以后，其他页面可以不再请求这一文件

##### 如何启用 `Server Push`

1. 需要在 `Cloudflare` 面板启用 `HTTP2`
2. 在需要 `Server Push` 的 `HTML` 文件发送时新增 `header` : `Link`
3. `Link` 需为 `HTML 5` 标准中 `<link rel="preload">` 的内容
   例如 `Link:</css/style.min.css>; rel=preload; as=style`

本站在使用 Cloudflare 作为 CDN 的情况下已启用 Server Push

#### `Header压缩` & `多路复用`

##### `Header压缩`

`HPACK` 算法是新引入 `HTTP/2` 的一个算法，用于对 `HTTP` 头部做压缩。可大幅度降低 `Header` 的请求用时

##### `多路复用`

`HTTP2.0` 会将一个 `TCP` 连接分为若干个 流（Stream），每个 流 中可以传输若干 消息（Message），每个 消息 由若干最小的二进制 帧（Frame） 组成
这个举措在 SPDY 中的实践表明，相比 HTTP/1.1，新页面加载可以加快 11.81% 到 47.7%

##### 如何启用

1. 在 `Cloudflare` 面板启用 `HTTP2`
2. Enjoy it

### 使用 `Cloudflare Partner` 来启用自选解析

使用 `Cloudflare Partner` 的自选解析可以有效的降低 `DNS` 请求用时,也可以对 `Cloudflare` 的 `Anycast` 网络进行部分自定义

文章引路-> [关于 Cloudflare 自选节点的一些个人见解 | Puresys](https://www.puresys.net/3116.html)

## 降低回源用时

但是，`Cloudflare` 中国大陆方向的网络质量是我们无法控制的，因此如果要缩短网站响应耗时、减少 `TTFB（首字节时间）` ，就只能在 `Cloudflare` 回源上做优化。

### 使用缓存规则

### 启用 `brotli` 压缩

### 将静态站点部署至 `Cloudflare Pages` or `Cloudflare Workers Sites`

## 前端性能优化

### 降低请求大小 数量

#### 使用 `NoModule/Module` 构建

#### 缩小组件粒度

#### 最小化 `HTML` `CSS` `JS`

### 预请求

#### 使用 Flying Pages

#### 使用 Workbox 来改造客户端缓存

### 懒加载

#### 使用 `vanilla-lazyload`

### ~~PWA~~

## ~~备案 上带国内CDN的企业版~~

## 借物表

[天下武功，唯快不破 —— 我是这样优化博客的 | Sukka's Blog](https://blog.skk.moe/post/how-to-make-a-fast-blog/)
[关于 Cloudflare 自选节点的一些个人见解 | Puresys](https://www.puresys.net/3116.html)
