---
title: Cloudflare Free Argo tunnel 白嫖计划 
date: 2021-01-13 19:06:21
tags:
    - Cloudflare
    - Argo tunnel
    - HowToRun
    - Website
    - Access
---
> 之前看到了 `Cloudflare Blog` 更新了 `[「A free Argo Tunnel for your next project」](https://blog.cloudflare.com/a-free-argo-tunnel-for-your-next-project/)` 一文，最近终于有空闲时间，搭建一个测试一下。

<!--more-->

## why

### 啥是 `Argo Tunnel`

> Argo隧道提供了一种简便的方法，可将Web服务器安全地公开到Internet，而无需打开防火墙端口和配置ACL。 Argo隧道还可以确保请求在到达网络服务器之前先通过Cloudflare进行路由，因此可以确保通过Cloudflare的WAF和Unmetered DDoS缓解功能停止了攻击流量，并且如果为帐户启用了这些功能，则可以通过Access进行身份验证。
>
> --翻译自 [`Argo Tunnel -- Cloudflare Docs`](https://developers.cloudflare.com/argo-tunnel/)

用人话理解 -> 可以用 `NAT`机子通过 `Argo Tunnel` 来穿透任意端口，并且还可以享受到 `Argo Smart Routing` 技术，极大幅度优化了回源速度，还有一大堆网络攻击保护技术也可以被启用。

这不得爽死吗（

### 啥是 `Argo Smart Routing`

`Argo Smart Routing` 是 `Cloudflare` 为优化回源性能所推出的一项技术，你可以在[这里](https://www.cloudflare.com/en-gb/products/argo-smart-routing/)获得技术详情

在未启用 `Argo Smart Routing` 前， `Cloudflare` 将会如此回源。

1. `Client` -> `Cloudflare Edge Server`
2. `Cloudflare Edge Server` -> `Trafic over Normal Internet Node` -> `Origin Server`

在启用 `Argo Smart Routing` 后， `Cloudflare` 将会如此回源。

1. `Client` -> `Cloudflare Edge Server`
2. `Cloudflare Edge Server` -> `Trafic over The Fast*** links` -> `Cloudflare Argo Server`
3. `Cloudflare Argo Server` <-> `Origin Server`

~~(因某些词语违反广告法，已经进行处理)~~

相较于未启用前，`Argo Smart Routing`可以有效优化请求用时。

## How

### Install [`Cloudflared`](https://github.com/cloudflare/cloudflared)

`Cloudflared` 作为源服务器和 `Cloudflare Argo Server` 的链接件，是必不可少的。

你可以参考[这里](https://github.com/cloudflare/cloudflared#installing-cloudflared)的文档。

在 `macOS` 上安装:
    - 在[这里](https://github.com/cloudflare/cloudflared/releases)下载releases来安装
    - 通过 `brew install cloudflare/cloudflare/cloudflared` 安装

在 `Linux` 上安装:
    - 参考[这里](https://developers.cloudflare.com/argo-tunnel/getting-started/installation#linux)进行安装

在 `Windows` 上安装:
    - 在[这里](https://github.com/cloudflare/cloudflared/releases)下载文件并打开当前路径的 `PowerShell` 备用

### Login

在终端执行以下操作

```bash
cloudflared login
```

选择Tunnel的域名，保存下来的证书请留下来备用。

### Run Hello world

1. 将需要 Tunnel 的域名解析到 `Cloudflare Edge Server` (仅对于CNAME接入情况)
2. 运行以下Command

    ```bash
    cloudflared tunnel --hostname <tunnelDomain> --hello-world
    ```

3. 打开被 `Tunnel` 的域名，如果可以看到 `Congrats! You created a tunnel!` 一行，则说明你的执行成果，快去搞些有意思的事情吧（
