---
title: 「 Run short links with AKA 」- 如何部署AKA
date: 2021-01-02 11:34:44
tags: 
    - aka
    - HowToRun
    - Cloudflare
    - Worker
    - node
    - WebSite
---

> [AKA](https://github.com/186526/aka) (Also Known As) 是一个简洁，快速，运行于 `Cloudflare` 的短网址服务。

AKA 分别有两个 `Worker` 组成，分别是其的的前端以及后端，你需要在本地安装 `node > 12` 的环境来支持其部署。

##### 别骂了别骂了 在写了在写了

<!-- more -->

## 安装所需工具

你需要拥有一个良好的网络链接，并拥有一个可用的域名并已经绑定至Cloudflare。

1. 安装 [`wrangler`](https://github.com/cloudflare/wrangler)

`wrangler` 是一个 `Worker` 部署工具，你可以使用其来部署 `Worker`。

如果你使用 `GNU/Linux` 你可以和我一样，选择使用 `npm` 进行安装。

``` Bash
npm i @cloudflare/wrangler -g
```


