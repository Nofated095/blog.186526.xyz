---
title: 「 Run short links service with AKA  」- 如何部署AKA
date: 2021-01-02 11:34:44
tags: 
    - aka
    - HowToRun
    - Cloudflare
    - Worker
    - node
    - WebSite
---

{% note warning %}
### 警告

AKA 将会在近期使用 [`sw2express`](https://git.186526.xyz/186526/sw2express) 进行重构。
KV 所存储的数据类型将不会兼容于旧版，届时会发布数据转换脚本。

{% endnote %}

> [AKA](https://github.com/186526/aka) (Also Known As) 是一个简洁，快速，前后端分离，运行于 `Cloudflare` 的短网址服务。
> <!-- more -->
> Demo: [186.rip](https://186.rip)

AKA 分别有两个 `Worker` 组成，分别是其的的前端以及后端，你需要在本地安装 `node > 12` 的环境来支持其部署。

## 本次部署所用环境

本次教程使用 `node v12.19.0` `wrangler 1.12.3` `Debian GNU/Linux 10 (buster) in a Docker Container , The Host uses Archlinux`

## 安装所需工具

你需要拥有一个良好的网络链接，并拥有一个可用的域名并已经绑定至Cloudflare。

### 安装 [`wrangler`](https://github.com/cloudflare/wrangler)

`wrangler` 是一个 `Worker` 部署工具，你可以使用其来部署 `Worker`。

你可以和我一样，选择使用 `npm` 进行安装。

``` Bash
npm i @cloudflare/wrangler -g
```

>如果你使用 `Windows` ，你可以选择下载并安装 `wrangler` 的[二进制包](https://github.com/cloudflare/wrangler/releases/latest)。

### 在 `wrangler` 中登陆帐号

使用 `wrangler login` 来进行授权。

### 下载本项目，并安装对应依赖

这里推荐使用 `git` 来拉取本项目，并使用 `npm` 作为包管理

``` Bash
$ git clone https://github.com/186526/aka.git

Cloning into 'aka'...
remote: Enumerating objects: 157, done.
remote: Counting objects: 100% (157/157), done.
remote: Compressing objects: 100% (96/96), done.
remote: Total 157 (delta 63), reused 148 (delta 54), pack-reused 0
Receiving objects: 100% (157/157), 468.87 KiB | 23.00 KiB/s, done.
Resolving deltas: 100% (63/63), done.

$ cd aka

$ cd frontend

$ npm i 
```

## 后端部署

### 修改配置

打开 `aka/backend` 文件夹，你可以找到一个名为 `wrangler.example.toml` 的文件。
该文件是 `aka/backend` 的 `wrangler` 默认配置文件。

将其重命名为 `wrangler.toml` ，并修改其内容

```toml
## Worker名称
name = "aka" 
## 项目配置信息，不要修改
type = "javascript" 
## accound_id 必须修改 可以在 「 Domain - API - Account ID 」 找到
account_id = "<account_id>" 
## worker.dev 域名分配，可关闭
workers_dev = true
## cloudflare route,若绑定自己域名需修改<domain>为自己域名
route = "<domain>/*"
## zone_id 只有在需要绑定域名时填写，可以在 「 Domain - API - Zone ID 」找到。
zone_id = "<zone_id>"
## <kv id> 填写为下文挂载的 kv
kv_namespaces = [ 
         { binding = "__aka__", id = "<kv id>" }
]
```

### 新建 `KV` 并挂载到对应项目

这里使用 `wrangler` 新建 `kv`

``` Bash
$ wrangler kv:namespace create __aka__
🌀  Creating namespace with title "aka-__aka__"
✨  Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "__aka__", id = "*********" }
```

将 `id` 的内容复制到上处 `wrangler.toml` 的 `<kv id>`。

### 部署后端 🚀

当你已经确保本地的配置已经没有问题时，可以准备部署该项目了。

``` bash
$ wrangler publish
✨  JavaScript project found. Skipping unnecessary build!
✨  Successfully published your script to
 16sl.ga/* => stayed the same
```

#### 验证部署

这里使用 `curl` 请求api来测试部署是否成功

``` bash
curl -X POST -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":3,"method":"create","params":{"name":"186rip","url":"https://186.rip"}}' https://<your_domain>/api/jsonrpc | jq
```

当返回值为下面这样时，表明你的后端安装没问题，快去安装前端吧（

``` json
{
  "jsonrpc": "2.0",
  "result": "/186rip",
  "id": 3
}
```

## 前端部署

### 修改配置文件

打开 `aka/frontend` 文件夹，你可以找到一个名为 `wrangler.example.toml` 的文件。
该文件是 `aka/frontend` 的 `wrangler` 默认配置文件。

将其重命名为 `wrangler.toml` ，并修改其内容

``` toml
## 项目名称
name = "aka_frontend"
## 项目类型 不要修改
type = "webpack"
## 用户ID 看上文如何获取
account_id = "<account_id>"
## worker.dev域名 可修改
workers_dev = true
## Clouflare Route,请将 <domain> 修改为上面所用域名
routes = [
    "<domain>/cdn-sources/*",
    "<domain>/sw.js",
    "<domain>/js/*",
    "<domain>/css/*",
    "<domain>/",
    "<domain>/index.html",
    "<domain>/assets/*",
    "<domain>/web_modules/*",
    "<domain>/_dist_/*",
    "<domain>/__snowpack__/*"
]
## zone_id 看上文进行修改
zone_id = "<zone_id>"

[site]
## Cloudflare Worker kv website的存储桶设置，不建议进行修改
bucket = "./build"
## 编译时所用worker,不要修改
entry-point = "workers-site"
```

### 部署前端 🚀

``` Bash
$ npm run build

> @ build /workspaces/aka/frontend
> snowpack build;mv ./build/_dist_/sw.js ./build/sw.js;node ./build.mjs

[snowpack] ! building source files...
[snowpack] ✔ build complete [0.06s]
[snowpack] ! installing dependencies...
[snowpack] ✔ install complete! [2.76s]
[snowpack] ! verifying build...
[snowpack] ✔ verification complete [0.01s]
[snowpack] ! writing build to disk...
[snowpack] ! optimizing build...
                                       Asset       Size  Chunks                         Chunk Names
            js/index.026479135f133c2ca9ad.js    121 KiB       0  [emitted] [immutable]  index
js/index.026479135f133c2ca9ad.js.LICENSE.txt   95 bytes          [emitted]              
  js/webpack-runtime.5072755c7971ba0e8aa3.js   1.46 KiB       1  [emitted] [immutable]  webpack-runtime
                               manifest.json  223 bytes          [emitted]              
[snowpack] ✔ optimize complete [5.75s]
[snowpack] ▶ Build Complete! ## 当你看到该句时，表明编译成功


(node:16309) ExperimentalWarning: The ESM module loader is experimental.


$ wrangler publish

⚠️  The following routes in your configuration file should have a trailing * to apply the Worker on every path, otherwise your site will not behave as expected.
16sl.ga/sw.js
16sl.ga/
16sl.ga/index.html
✨  Built successfully, built project size is 13 KiB.
🌀  Using namespace for Workers Site "__aka_frontend-workers_sites_assets"
✨  Success
🌀  Uploading site files
✨  Successfully published your script to
 16sl.ga/cdn-sources/* => stayed the same
 16sl.ga/sw.js => stayed the same
 16sl.ga/js/* => stayed the same
 16sl.ga/css/* => stayed the same
 16sl.ga/ => stayed the same
 16sl.ga/index.html => stayed the same
 16sl.ga/assets/* => stayed the same
 16sl.ga/web_modules/* => stayed the same
 16sl.ga/_dist_/* => stayed the same
 16sl.ga/__snowpack__/* => stayed the same
```

至此，aka的整个部署完成了。
