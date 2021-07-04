---
title: 从编译内核开始的内核更新之旅
date: 2021-07-03 23:34:27
tags:
    - Ubuntu
    - Linux
    - Debootstrap
thumbnail: /assets/Tux.png
---

正如你所见的那样, 这是一篇有关于内核 更新/编译 的文章.

<!--more-->

> 头图来自 [github:garrett/Tux](https://github.com/garrett/Tux), 使用 CC0 授权.

{% note info %}

### 0.0 提示

该文章还未写完, 写完再说 (

{% endnote %}

{% note warning %}

### 0.1 警告

本文仅为一篇 ***教程性*** 文章, 将不会讨论有关更深层次的技术问题.
若有错误, 欢迎在评论区进行指正或发送邮件至 `i@186526.xyz`.

{% endnote %}

## 1.0 获取所需材料

你可能会需要以下物品来完成你的内核编译.

1. 一台可用的且运行 GNU/Linux 并有 Root 权限 的设备
2. 正常且快速的 Internet 链接
3. ~~空调~~ ~~快乐水~~ 正常且可用并且出问题会自己 Google 的大脑

## 1.1 启动设备

我们这里使用运行在 FireCracker / KVM 上的 Debian Buster 作为编译设备.
为了安全, 我们建议创建

```bash
# 使用 ignite 快速的创建使用 Debian Buster 的 FireCracker 系统容器.

$ sudo ignite run registry.186526.xyz/186526/ignite-debian \
    --cpus 12 \
    --memory 8GB \
    --size 30g \
    --ssh --name kernel-builder \
    -k  registry.186526.xyz/186526/ignite-kernel:5.10.39-amd64

INFO[0001] Created VM with ID "95b84f2c9e92ffa7" and name "kernel-builder" 
INFO[0002] Networking is handled by "cni"               
INFO[0002] Started Firecracker VM "95b84f2c9e92ffa7" in a container with ID "ignite-95b84f2c9e92ffa7" 
INFO[0002] Waiting for the ssh daemon within the VM to start... 

# 连接至该容器

$ sudo ignite ssh kernel-builder 

# 创建用于内核编译的用户, 名为 builder

(inFireCrackerContainer) # adduser builder

Adding user `builder' ...
Adding new group `builder' (1000) ...
Adding new user `builder' (1000) with group `builder' ...
Creating home directory `/home/builder' ...
Copying files from `/etc/skel' ...
New password: 
Retype new password: 
passwd: password updated successfully
Changing the user information for builder
Enter the new value, or press ENTER for the default
        Full Name []: 
        Room Number []: 
        Work Phone []: 
        Home Phone []: 
        Other []: 
Is the information correct? [Y/n] Y

```

## 1.2 安装所需编译依赖

我们这里使用的是 Debian, 使用的是 DPKG/APT 包管理.
其他发行版请参考对应文章进行编译依赖的安装.
若使用APT, 你需要加入 Source 源来完成依赖的安装.

``` bash
# 更新 APT 的缓存信息

apt update -y

# 安装 编译依赖
apt install build-essential libncurses5-dev xz-utils wget -y
apt-get build-dep linux -y
```

## 1.3 准备源代码

我们这里将会选择截止本文章编写时最新 (2021.07.03) 的 [Stable Kernel](https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.12.14.tar.xz) (即 5.12.14)

你可以在 [kernel.org](https://kernel.org) 选择所需 Kernel 来编译.

``` Bash
# 进入 builder 账户

su - builder

# 下载 linux-5.12.14.tar.xz 源码文件

mkdir -p build && cd build && wget https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.12.14.tar.xz

# 解压内核源码

tar xvf linux-5.12.14.tar.xz && cd linux-5.12.14
```

## 2.1 配置内核

配置内核是个细心活, 你可能能需要大量的时间和精力来配置一个针对你设备最好的内核.
如果你觉得你很懒, 你可以选择我在这里配置好的针对 KVM/QEMU 环境的内核配置.
你也可以在 `/boot/config-$(uname -r)` 中找到你当前内核的配置.

```bash
# 我们这里选择下载


```
