---
title: Ethernet 的学习笔记
description: '本文在涉及到 AI 生成内容的时候，会使用 [AIGC] 标签。'
publishedAt: 2026-06-19T15:10:01.000Z
tags:
  - Ethernet
  - Rust
draft: false
lang: zh-CN
---
本文在涉及到 AI 生成内容的时候，会使用 [AIGC] 标签。

## 以太网帧

我在研究以太网帧过后发现，每个标准的以太网帧都包含一个 `Header` 以及一个长度可以为 0 的 `Payload`，

Header 中又包含：
- 源 Mac 地址、目标 Mac 地址（也是判断是否为广播的依据）以及帧的类型（IPV4、IPV6、ARP 等）

Payload 中包含：
- 各个协议(IPV4、IPV6 等)的包

以下为图解
```
[ Ethernet Frame ]
    ├── Ethernet Header
    └── Payload
            ├── IPv4 Packet
            |       ├── IPv4 Header
            |       └── Payload
            ├── IPv6 Packet
            |       ├── IPv6 Header
            |       └── Payload
            └── ARP Packet
```

---

## IPv4 包

IPv4 包中含一个 `Header` 和一个 `Payload`， 
`Header` 是整个包的前 20 个字节，其中包含了：

- Version(版本)、Type of Service(服务类型)、IHL(头长度)、Total Length(总长度)、   
- Identification(分片 ID)、Flags(分片控制位)、Fragment Offset(当前分片在原始数据中的位置)、       
- TTL(存活时间)、Protocol(协议类型)、Header Checksum(校验和)、    
- Source IP Address(源 IP 地址)、 
- Destination IP Address(目标 IP 地址)、  
- Options(选项，此为可选)、       
- Payload(载荷)


以下为图解 [AIGC]
```
0                   1                   2                   3
0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1

+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|Version|  IHL  |Type of Service|        Total Length         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|       Identification          |Flags|    Fragment Offset    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|   TTL   |    Protocol         |       Header Checksum       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                       Source IP Address                     |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Destination IP Address                   |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Options (optional)                       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                           Payload                           |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

在本项目里，我们只关注 `Version、IHL、Total Length、TTL、Protocol、Source IP、Destination IP、Payload` 这几个字段

## IPv6 包

IPv6 包中同样包含一个 `Header` 和一个 `Payload`。  
`Header` 固定为 40 字节，常见字段包含：

- Version(版本)、Traffic Class(流量类别)、Flow Label(流标签)、Payload Length(载荷长度)、
- Next Header(下一头部/上层协议类型)、Hop Limit(跳数限制)、
- Source Address(源 IPv6 地址)、
- Destination Address(目标 IPv6 地址)、
- Payload(载荷)

以下为图解 [AIGC]
```
0                   1                   2                   3
0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1

+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|Version| Traffic Class |           Flow Label                |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Payload Length        | Next Header  |  Hop Limit   |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                             |
+                                                             +
|                                                             |
+                       Source Address                        +
|                                                             |
+                                                             +
|                                                             |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                             |
+                                                             +
|                                                             |
+                    Destination Address                      +
|                                                             |
+                                                             +
|                                                             |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                           Payload                           |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

在本项目里，我们只关注 `Version、Payload Length、Next Header、Hop Limit、Source Address、Destination Address、Payload` 这几个字段

## Arp 包

ARP 包用于在局域网中根据 IP 地址查询对应的 MAC 地址。  
ARP 报文由固定格式字段组成（无复杂可变头部），常见字段包含：

- Hardware Type(硬件类型)、Protocol Type(协议类型)、
- HLen(硬件地址长度)、PLen(协议地址长度)、Operation(操作码：请求/响应)、
- Sender Hardware Address(发送方 MAC)、Sender Protocol Address(发送方 IP)、
- Target Hardware Address(目标 MAC)、Target Protocol Address(目标 IP)

其中：
- ARP Request：通常已知目标 IP，不知道目标 MAC（THA 常为全 0）
- ARP Reply：返回目标 IP 对应的目标 MAC


以下为图解 [AIGC]
```
0                   15 16                  31
+---------------------+---------------------+
| Hardware Type       | Protocol Type       |
+---------------------+---------------------+
| HLen | PLen |       Operation             |
+---------------------+---------------------+
| Sender Hardware Address (SHA)             |
+-------------------------------------------+
| Sender Protocol Address (SPA)             |
+-------------------------------------------+
| Target Hardware Address (THA)             |
+-------------------------------------------+
| Target Protocol Address (TPA)             |
+-------------------------------------------+
```

在本项目里，我们只关注 `Hardware Type、Protocol Type、Operation、Sender Hardware Address、Sender Protocol Address、Target Hardware Address、Target Protocol Address` 这几个字段

---
未完待续...
