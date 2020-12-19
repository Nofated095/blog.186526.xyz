---
title: 如何使用debootstrap构建一个最小化的Ubuntu
date: 2020-12-19 22:39:33
tags:
    - Ubuntu
    - Linux
    - Debootstrap
---

> debootstrap是debian及其附属分支下的一个工具，用来构建一套基本的系统(根文件系统)。生成的目录符合Linux文件系统标准(FHS)，即包含了/boot、/etc、/bin、/usr等等目录，但它比发行版本的Linux体积小很多

<!--more-->

## 0.0 debootstrap介绍

### 0.1 啥是debootstrap

debootstrap是debian及其附属分支下的一个工具，用来构建一套基本的系统(根文件系统)。生成的目录符合Linux文件系统标准(FHS)，即包含了/boot、/etc、/bin、/usr等等目录，但它比发行版本的Linux体积小很多 

~~似曾相识燕归来~~

### 0.2 debootstrap有啥用

debootstrap可以用来快速 简便的构建一个最小化的debian及其附属分支的最小化rootfs

我们可以用其构建一个最小化的rootfs (主要是这个相较于 Ubuntu Server版本还是小得多)

### 0.3 如何使用debootstrap

其实 使用debootstrap很简单 他已经被放入到默认源了 我们只需要apt install即可

``` bash
sudo apt install debootstrap
```

如何使用呢 ~~自己看~~ 详情wiki

```bash
sudo debootstrap [--arch 架构（可选项）][发行版本] [目录] [映像源（可选项）]
```

## 1.0 开始动手构建自己的Ubuntu

我们这里使用Ubuntu Server 20.04作为Live CD来进行构建

### 1.1 进入Shell并安装debootstrap

![Ubuntu ISO shell](https://cdn.jsdelivr.net/gh/186526/jsdelivr@master/img/Ubuntu%20ISO.png)

1. 点击Help

2. Enter Shell

3. （可选）修改sources.list

4. update sourcelist并安装debootstrap

``` bash
$ sudo apt update && apt install debootstrap
    Ign:1 cdrom://Ubuntu-Server 20.04 LTS _Focal Fossa_ - Release amd64 (20200423) focal InRelease
    Hit:2 cdrom://Ubuntu-Server 20.04 LTS _Focal Fossa_ - Release amd64 (20200423) focal Release
    Get:4 http://mirrors.aliyun.com/ubuntu focal InRelease [265 kB]
    Get:5 http://mirrors.aliyun.com/ubuntu focal-updates InRelease [107 kB]
    Get:6 http://mirrors.aliyun.com/ubuntu focal-backports InRelease [98.3 kB]
    Get:7 http://mirrors.aliyun.com/ubuntu focal-security InRelease [107 kB]
    Get:8 http://mirrors.aliyun.com/ubuntu focal/main amd64 Packages [970 kB]
    Get:9 http://mirrors.aliyun.com/ubuntu focal/main Translation-en [506 kB]
    Get:10 http://mirrors.aliyun.com/ubuntu focal/main amd64 c-n-f Metadata [29.5 kB]
    Get:11 http://mirrors.aliyun.com/ubuntu focal/restricted amd64 Packages [22.0 kB]
    Get:12 http://mirrors.aliyun.com/ubuntu focal/restricted Translation-en [6212 B]
    Get:13 http://mirrors.aliyun.com/ubuntu focal/restricted amd64 c-n-f Metadata [392 B]
    Get:14 http://mirrors.aliyun.com/ubuntu focal/universe amd64 Packages [8628 kB]
    Get:15 http://mirrors.aliyun.com/ubuntu focal/universe Translation-en [5124 kB]
    Get:16 http://mirrors.aliyun.com/ubuntu focal/universe amd64 c-n-f Metadata [265 kB]
    Get:17 http://mirrors.aliyun.com/ubuntu focal/multiverse amd64 Packages [144 kB]
    Get:18 http://mirrors.aliyun.com/ubuntu focal/multiverse Translation-en [104 kB]
    Get:19 http://mirrors.aliyun.com/ubuntu focal/multiverse amd64 c-n-f Metadata [9136 B]
    Get:20 http://mirrors.aliyun.com/ubuntu focal-updates/main amd64 Packages [197 kB]
    Get:21 http://mirrors.aliyun.com/ubuntu focal-updates/main Translation-en [77.7 kB]
    Get:22 http://mirrors.aliyun.com/ubuntu focal-updates/main amd64 c-n-f Metadata [5676 B]
    Get:23 http://mirrors.aliyun.com/ubuntu focal-updates/restricted amd64 Packages [11.0 kB]
    Get:24 http://mirrors.aliyun.com/ubuntu focal-updates/restricted Translation-en [3000 B]
    Get:25 http://mirrors.aliyun.com/ubuntu focal-updates/restricted amd64 c-n-f Metadata [116 B]
    Get:26 http://mirrors.aliyun.com/ubuntu focal-updates/universe amd64 Packages [110 kB]
    Get:27 http://mirrors.aliyun.com/ubuntu focal-updates/universe Translation-en [51.9 kB]
    Get:28 http://mirrors.aliyun.com/ubuntu focal-updates/universe amd64 c-n-f Metadata [4092 B]
    Get:29 http://mirrors.aliyun.com/ubuntu focal-updates/multiverse amd64 Packages [1172 B]
    Get:30 http://mirrors.aliyun.com/ubuntu focal-updates/multiverse Translation-en [540 B]
    Get:31 http://mirrors.aliyun.com/ubuntu focal-updates/multiverse amd64 c-n-f Metadata [116 B]
    Get:32 http://mirrors.aliyun.com/ubuntu focal-backports/main amd64 c-n-f Metadata [112 B]
    Get:33 http://mirrors.aliyun.com/ubuntu focal-backports/restricted amd64 c-n-f Metadata [116 B]
    Get:34 http://mirrors.aliyun.com/ubuntu focal-backports/universe amd64 Packages [2784 B]
    Get:35 http://mirrors.aliyun.com/ubuntu focal-backports/universe Translation-en [1272 B]
    Get:36 http://mirrors.aliyun.com/ubuntu focal-backports/universe amd64 c-n-f Metadata [192 B]
    Get:37 http://mirrors.aliyun.com/ubuntu focal-backports/multiverse amd64 c-n-f Metadata [116 B]
    Get:38 http://mirrors.aliyun.com/ubuntu focal-security/main amd64 Packages [106 kB]
    Get:46 http://mirrors.aliyun.com/ubuntu focal-security/universe amd64 c-n-f Metadata [1612 B]
    Get:47 http://mirrors.aliyun.com/ubuntu focal-security/multiverse amd64 Packages [1172 B]
    Get:48 http://mirrors.aliyun.com/ubuntu focal-security/multiverse Translation-en [540 B]
    Get:49 http://mirrors.aliyun.com/ubuntu focal-security/multiverse amd64 c-n-f Metadata [116 B]
    Fetched 17.1 MB in 6s (3096 kB/s)
    Reading package lists... Done
    Building dependency tree
    Reading state information... Done
    65 packages can be upgraded. Run 'apt list --upgradable' to see them.
    Reading package lists... Done
    Building dependency tree
    Reading state information... Done
    Suggested packages:
      arch-test squid-deb-proxy-client
    The following NEW packages will be installed:
      debootstrap
    0 upgraded, 1 newly installed, 0 to remove and 65 not upgraded.
    Need to get 39.4 kB of archives.
    After this operation, 299 kB of additional disk space will be used.
    Get:1 http://mirrors.aliyun.com/ubuntu focal-updates/main amd64 debootstrap all 1.0.118ubuntu1.1 [39.4 kB]
    Fetched 39.4 kB in 0s (221 kB/s)
    Selecting previously unselected package debootstrap.
    (Reading database ... 33860 files and directories currently installed.)
    Preparing to unpack .../debootstrap_1.0.118ubuntu1.1_all.deb ...
    Unpacking debootstrap (1.0.118ubuntu1.1) ...
    Setting up debootstrap (1.0.118ubuntu1.1) ...
    Processing triggers for man-db (2.9.1-1) ...
$ debootstrap
    I: usage: [OPTION]... <suite> <target> [<mirror> [<script>]]
    I: Try `debootstrap --help' for more information.
    E: You must specify a suite and a target.
```

### 1.2 给硬盘分区

这步没啥好说的 用cfdisk进行分区 使用mkfs.ext4来格式化硬盘（请记住如何分区的！！！！（后面编写fstab会涉及到））

| /dev路径  | 挂载位置 | 分区模式 | 作用        |
| --------- | -------- | -------- | ----------- |
| /dev/sda1 | /boot    | fat32    | 负责efi引导 |
| /dev/sda2 | swap     | swap     | 内存交换    |
| /dev/sda3 | /        | ext4     | 根目录      |

```bash
$ mkfs.ext4 /dev/sda3
mke2fs 1.45.5 (07-Jan-2020)
Creating filesystem with 9311995 4k blocks and 2330160 inodes
Filesystem UUID: fbe7f7fe-1997-4ab3-929f-52aa73aa72eb
Superblock backups stored on blocks:
        32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208,
        4096000, 7962624

Allocating group tables: done
Writing inode tables: done
Creating journal (65536 blocks): done
Writing superblocks and filesystem accounting information: done

$ mkswap /dev/sda2
Setting up swapspace version 1, size = 4 GiB (4294963200 bytes)s
no label, UUID=9fe83e8e-cd78-4a25-8a1e-ab305181c46d
$ swapon /dev/sda2
$ mkfs.vfat /dev/sda1
mkfs.fat 4.1 (2017-01-24)

```

### 1.3 挂载分区并释放rootfs

这里构建选择最新的Focal X86_64位

```bash
$ mkdir /target
$ mount /dev/sda3 /target
$ debootstrap focal /target http://mirrors.aliyun.com/ubuntu
I: Retrieving InRelease
I: Checking Release signature
I: Valid Release signature (key id F6ECB3762474EDA9D21B7022871920D1991BC93C)
I: Retrieving Packages
I: Validating Packages
I: Resolving dependencies of required packages...
I: Resolving dependencies of base packages...
I: Checking component main on http://mirrors.aliyun.com/ubuntu...
I: Retrieving adduser 3.118ubuntu2
I: Validating adduser 3.118ubuntu2
I: Retrieving apt 2.0.2
I: Validating apt 2.0.2
…………………………………………………………
I: Configuring console-setup...
I: Configuring kbd...
I: Configuring ubuntu-minimal...
I: Configuring libc-bin...
I: Configuring systemd...
I: Configuring ca-certificates...
I: Base system installed successfully. ##当你看到这句时 说明你的操作没有问题
```

### 1.4 chroot并进行基本设置

#### 1.4.1 修改软件源

默认rootfs中的软件源不完整 我们这里cp一下live cd的软件源

``` bash
cp /etc/apt/sources.list /target/etc/apt/sources.list;sed -i 3d /target/etc/apt/sources.list
```

``` bash
$ cat >> /target/etc/apt/sources.list << EOF
# See http://help.ubuntu.com/community/UpgradeNotes for how to upgrade to
# newer versions of the distribution.
deb http://mirrors.aliyun.com/ubuntu/ focal main restricted
# deb-src http://mirrors.aliyun.com/ubuntu/ focal main restricted
## Major bug fix updates produced after the final release of the
## distribution.
deb http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted
# deb-src http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted
## N.B. software from this repository is ENTIRELY UNSUPPORTED by the Ubuntu
## team. Also, please note that software in universe WILL NOT receive any
## review or updates from the Ubuntu security team.
deb http://mirrors.aliyun.com/ubuntu/ focal universe
# deb-src http://mirrors.aliyun.com/ubuntu/ focal universe
deb http://mirrors.aliyun.com/ubuntu/ focal-updates universe
# deb-src http://mirrors.aliyun.com/ubuntu/ focal-updates universe
## N.B. software from this repository is ENTIRELY UNSUPPORTED by the Ubuntu
## team, and may not be under a free licence. Please satisfy yourself as to
## your rights to use the software. Also, please note that software in
## multiverse WILL NOT receive any review or updates from the Ubuntu
## security team.
deb http://mirrors.aliyun.com/ubuntu/ focal multiverse
# deb-src http://mirrors.aliyun.com/ubuntu/ focal multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-updates multiverse
# deb-src http://mirrors.aliyun.com/ubuntu/ focal-updates multiverse
## N.B. software from this repository may not have been tested as
## extensively as that contained in the main release, although it includes
## newer versions of some applications which may provide useful features.
## Also, please note that software in backports WILL NOT receive any review
## or updates from the Ubuntu security team.
deb http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
# deb-src http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
## Uncomment the following two lines to add software from Canonical's
## 'partner' repository.
## This software is not part of Ubuntu, but is offered by Canonical and the
## respective vendors as a service to Ubuntu users.
# deb http://archive.canonical.com/ubuntu focal partner
# deb-src http://archive.canonical.com/ubuntu focal partner
deb http://mirrors.aliyun.com/ubuntu/ focal-security main restricted
# deb-src http://mirrors.aliyun.com/ubuntu/ focal-security main restricted
deb http://mirrors.aliyun.com/ubuntu/ focal-security universe
# deb-src http://mirrors.aliyun.com/ubuntu/ focal-security universe
deb http://mirrors.aliyun.com/ubuntu/ focal-security multiverse
# deb-src http://mirrors.aliyun.com/ubuntu/ focal-security multiverse
```

#### 1.4.2 编写fstab

这里推荐一下这篇文章 [linux之fstab文件详解 来自csdn richerg85](https://blog.csdn.net/richerg85/article/details/17917129)

fstab主要由这几部分组成

``` text
<file system>   <dir>   <type>  <options>   <dump>  <pass>
（/dev下的位置）（挂载位置）（文件系统）（挂载参数）（dump 工具通过它决定何时作备份）（fsck 读取 <pass> 的数值来决定需要检查的文件系统的检查顺序。）
```

这里以我的fstab文件作为实例

```bash
$ cat >> /target/etc/fstab << EOF
tmpfs           /tmp    tmpfs   nodev,nosuid            0       0
/dev/sda2       none    swap    defaults                0       0
/dev/sda3       /       ext4    defaults,noatime        0       0
```

#### 1.4.3 chroot进入系统

先挂载efi分区

```bash
mkdir /target/boot/efi && \
mount /dev/sda1 /target/boot/efi
```

挂载proc等分区

```bash
for i in /dev /dev/pts /proc /sys /run; do sudo mount -B $i /target$i; done
```

挂载并安装grub和kernel(这里安装的是虚拟化内核)

```bash
$ sudo chroot /target
$ sudo passwd ##配置passwd
New password:
Retype new password:
passwd: password updated successfully
$ sudo apt install grub-efi-amd64 linux-virtual -y ##安装grub和kernel
Reading package lists... Done
Building dependency tree
Reading state information... Done
The following additional packages will be installed:
  efibootmgr gettext-base grub-common grub-efi-amd64-bin grub-efi-amd64-signed grub2-common libefiboot1 libefivar1
  libfreetype6 libfuse2 libpng16-16 linux-headers-generic linux-headers-virtual os-prober sbsigntool secureboot-db
Suggested packages:
rvice.
Running in chroot, ignoring request: daemon-reload
Running in chroot, ignoring request: is-active
Running in chroot, ignoring request: start
Setting up libefiboot1:amd64 (37-2ubuntu2) ...
Setting up linux-virtual (5.4.0.26.32) ...
Setting up libfreetype6:amd64 (2.10.1-2) ...
Setting up efibootmgr (17-1) ...
Setting up grub-common (2.04-1ubuntu26) ...
Running in chroot, ignoring request: daemon-reload
Running in chroot, ignoring request: daemon-reload
Running in chroot, ignoring request: is-active
Running in chroot, ignoring request: restart
update-rc.d: warning: start and stop actions are no longer supported; falling back to defaults
Running in chroot, ignoring request: daemon-reload
Running in chroot, ignoring request.
Running in chroot, ignoring request: daemon-reload
Running in chroot, ignoring request: is-active
Running in chroot, ignoring request: restart
Setting up os-prober (1.74ubuntu2) ...
Setting up grub-efi-amd64-bin (2.04-1ubuntu26) ...
Setting up grub2-common (2.04-1ubuntu26) ...
Setting up grub-efi-amd64 (2.04-1ubuntu26) ...
Setting up grub-efi-amd64-signed (1.142+2.04-1ubuntu26) ...
Processing triggers for systemd (245.4-4ubuntu3) ...
Running in chroot, ignoring request: daemon-reload
Processing triggers for libc-bin (2.31-0ubuntu9) ...
```

#### 1.4.4 安装grub2

```bash
$ grub-install /dev/sda
update-grub Installing for x86_64-efi platform.
Installation finished. No error reported.
$ update-grub
Sourcing file `/etc/default/grub'
Sourcing file `/etc/default/grub.d/init-select.cfg'
Generating grub configuration file ...
Found linux image: /boot/vmlinuz-5.4.0-26-generic
Found initrd image: /boot/initrd.img-5.4.0-26-generic
Adding boot menu entry for UEFI Firmware Settings
done
```

#### 1.4.5 设置网络

Ubuntu 18.04及其上的Server版本默认使用systemd-networkd联网

先使用ip a获取设备

```bash
$ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000 ## ens33就是网络设备
    link/ether 00:0c:29:9d:a0:73 brd ff:ff:ff:ff:ff:ff
    inet 192.168.57.140/24 brd 192.168.57.255 scope global dynamic ens33
       valid_lft 5433596sec preferred_lft 5433596sec
    inet6 fe80::20c:29ff:fe9d:a073/64 scope link
       valid_lft forever preferred_lft forever
```

配置所有网卡DHCP联网

```bash
$ cat >> /etc/systemd/network/ens33.network << EOF
[Match]
Name=*
[Network]
DHCP=both
```

#### 1.4.6 重启

```bash
$ exit
exit

reboot
```

PS: 第一次开机会有一点点慢（就亿点点）

### 1.5 重启并配置网络

启动systemd-networkd

```bash
$ systemctl enable --now systemd-networkd
Created symlink /etc/systemd/system/dbus-org.freedesktop.network1.service → /lib/systemd/system/systemd-networkd.service.
Created symlink /etc/systemd/system/multi-user.target.wants/systemd-networkd.service → /lib/systemd/system/systemd-networkd.service.
Created symlink /etc/systemd/system/sockets.target.wants/systemd-networkd.socket → /lib/systemd/system/systemd-networkd.socket.
Created symlink /etc/systemd/system/network-online.target.wants/systemd-networkd-wait-online.service → /lib/systemd/system/systemd-networkd-wait-online.service.
```

修改hostname并添加hosts

```bash
$ hostnamectl set-hostname vm-ubuntu-test
$ cat >> /etc/hosts << EOF
127.0.0.1       vm-ubuntu-test localhost
::1             vm-ubuntu-test localhost ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters
```

最后reboot生效

享受全新的ubuntu体验吧
