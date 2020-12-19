---
title: Onemanager-php 缓存0->1
date: 2020-12-19 22:32:27
tags:
    - Onemanager-php
    - Cloudflare
    - Worker
---

因为一些众所周知的原因 你需要将OneManager-php站点使用 `Cloudflare`  那么这篇文章貌似就有用了（
<!--more-->

## 目录

1. [可自定义域名](#VPS、网站空间、Heroku-绑卡及其他可自定义域名情况下)
2. [不可自定义](#Heroku-不绑定卡等不可自定义域名)
3. [检查缓存](#Check-Cache)

## VPS、网站空间、Heroku 绑卡及其他可自定义域名情况下

在这种情况下 只需要配置 Cloudflare 的页面规则即可

1. 第一条规则 配置到`<OM域名>/*`上:

   - 缓存级别请使用缓存全部内容
   - 浏览器缓存看心情设置
   - 边缘缓存建议设置 8 小时(该项即为索引的 cf cdn 缓存时间)
   - 若已经配置网站空间缓存规则可开缓存控制 否则不开启
   - 可开启 Always Online 以及 Auto Minify

2. 第二条规则 配置到`<OM域名>/*?*`上:

   - 浏览器缓存配置看心情设置
   - 边缘缓存建议配置 8 小时
   - 缓存级别请使用没有查询字符串
   - 若已经配置网站空间缓存规则可开缓存控制 否则不开启
   - 可开启 Always Online 以及 Auto Minify

3. 第三条缓存 配置到`<OM页面>/*nocache*`上:

   - 缓存级别请选择绕过
   - 其他同第二条

索引将会被缓存 管理后台以及文件路径中包含`nocache`的 url 将不会被缓存

请跳转至[查询缓存是否生效](#Check_Cache)

## Heroku 不绑定卡等不可自定义域名

我们需要使用`Cloudflare Worker`以及`Booster.js`

> [`Cloudflare Worker`](https://workers.dev)是一个`Serverless`函数 Platform 运行于`Cloudflare`边缘节点上
>
> [`Booster.js`](https://github.com/xiaoyang-liu-cs/booster.js/)是一个运行于`Cloudflare Worker`的反向代理项目

你需要打开[`Cloudflare Worker`](https://workers.dev) 注册 Worker 账户

在[此处](https://github.com/186526/Boomer.js/blob/main/index-min.js)复制代码 并部署（Star后上车）

请跳转至[查询缓存是否生效](#Check_Cache)

## Check_Cache

1. 方法一:
   - 打开 CMD
   - 输入 `curl -I <your domain>`
   - 当出现类似一下情况 即表示配置成功

```text
C:\Users\186526>curl -I https://imagedl.186526.xyz
HTTP/1.1 200 OK
Date: Sun, 04 Oct 2020 06:14:48 GMT
Content-Type: text/html;charset=UTF-8
Connection: keep-alive
Set-Cookie: __cfduid=d785548bd40d709c98c06a349988227d71601792088; expires=Tue, 03-Nov-20 06:14:48 GMT; path=/; domain=.186526.xyz; HttpOnly; SameSite=Lax; Secure
Vary: Accept-Encoding
Cache-Control: max-age=86400
CF-Cache-Status: HIT //该项表示命中
Age: 54321
cf-request-id: 0593d8b2f80000d346c4af3200000001
Expect-CT: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
Report-To: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report?lkg-colo=12&lkg-time=1601792089"}],"group":"cf-nel","max_age":604800}
NEL: {"report_to":"cf-nel","max_age":604800}
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Server: cloudflare
CF-RAY: 5dccc3cb2d69d346-LAX
alt-svc: h3-27=":443"; ma=86400, h3-28=":443"; ma=86400, h3-29=":443"; ma=86400
```

2. 方法二:
   - 打开 Chrome Devtool
   - 选择 Network
   - 点击第一项
   - 若`Response Header`中`cf-cache-status`值为`HIT` 表明缓存成功

又水完一篇文章 溜了溜了
