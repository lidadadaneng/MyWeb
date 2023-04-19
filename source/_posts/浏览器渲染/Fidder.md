---
title: Fidder
date: 2023-03-16 16:42:50
categories:
- 前端
- 浏览器原理
- 计算机网络
tags:
- 浏览器原理
- 计算机网络
typora-root-url: ..\..
---

# **Fidder**

![39a7e73fcff2d043b46ef670a66e9fb7_627x282.png](/image/浏览器渲染/1625128976890-37ddaa42-c2af-4bcd-8c2d-cb65d9c4cb46.png)

# **1、简介**

**概念** ：Fidder是位于客户端和服务器端的HTTP代理

目前最常用的http抓包工具之一，功能非常强大，是web调试的利器。

```
1、监控浏览器所有http-https流量
2、查看、分析请求内容细节
3、伪造客户端请求和服务器响应
4、测试网站的性能
5、解密https的web会话
6、全局、局部断点功能
```

**使用场景**

>接口测试、接口调试、线上环境调试、web性能分析
>
>判断前后端bug、开发环境hosts配置、mock、弱网断网测试

# **2、工具的使用**

### 1、修改端口

![01.png](/image/浏览器渲染/1625107060813-c0376879-30be-47aa-8fbb-fc325bb5f26f.png)

![02.png](/image/浏览器渲染/1625107095660-f15ab61b-35bf-4132-9cab-2469f56c8214.png)

![03.png](/image/浏览器渲染/1625107170673-9f38e829-9c85-44a9-9d18-458c07c63404.png)

### 2、简单配置Rules

![04.png](/image/浏览器渲染/1625107327791-ccea2bbf-4adf-45d2-a503-63ebd6688f5b.png)

# **3、工具条讲解**

![05.png](/image/浏览器渲染/1625107558239-f2a04051-0e2e-46fc-a7d7-bb1c39db8538.png)

```
http://47.108.197.28:4000/api/article
```

### 1、给http请求添加注释

![06.png](/image/浏览器渲染/1625107829865-43b4f260-72c2-4583-9803-e991109dfd95.png)

### 2、Replay

> 重复发送http请求

| R       | 重复发送http请求 |
| ------- | ---------------- |
| shift+R | 输入发送的次数   |
| ctrl+x  | 删除所有的会话   |

### 3、Stream

```
缓冲模式  拦截服务器端的响应，一次返回给客户端
流模式    服务器响应什么，客户端就获取什么
```

### 4、Decode解码

### 5、Keep: sessions保持会话的数量

### 6、TextWizard

![img](/image/浏览器渲染/1625118359314-841a7031-36bf-450a-a17c-1389d094027d.png)

### 7、online

![02.png](/image/浏览器渲染/1625118476971-1a74a124-ddff-490f-b788-131e008f817b.png)

# **4、监控面板**

![03.png](/image/浏览器渲染/1625118655251-8c3caae8-c5fc-49f6-918f-df046d4f6247.png)

**作用:** 抓取每条http请求(每一条称为一个session);

![04.png](/image/浏览器渲染/1625119266530-6b866465-eef6-4547-b3b8-3267ba6cc402.png)

### 1、自定义目标ip

点击菜单栏Rules->CustomRules然后按Ctrl+F搜索 static function Main() 即可看到如下内容，粘贴规则

```js
static function Main() {
var today: Date = new Date();
FiddlerObject.StatusText = " CustomRules.js was loaded at: " + today;
//显示请求的目标IP地址，复制下面这行贴上
FiddlerObject.UI.lvSessions.AddBoundColumn("ServerIP", 120, "X-HostIP");
}
```

![05.png](/image/浏览器渲染/1625119783010-8a82e063-8ec9-4b30-95de-4ed2ee3c06f3.png)

# **5、状态栏和命令行**

![06.png](/image/浏览器渲染/1625120417422-f1bd3036-49b0-485f-b674-31fdce3f1d34.png)

# **6、辅助标签+工具**

### 1、statistics统计

HTTP请求的性能和其他数据分析，如DSN解析的时间，建立TCP/IP连接的时间消耗等信息。

对请求的一些性能分析

![07.png](/image/浏览器渲染/1625122101439-95ebf7d2-c51b-4833-95e9-13560e7edfa4.png)

### 2、Inspectors

检查器

![08.png](/image/浏览器渲染/1625122548711-92c69c33-064e-4c60-9255-5809519b9ea9.png)

### 3、AutoResponder（自动响应器）

可用于拦截某一请求，进行如下操作:

- 重定向本地的资源
- 使用Fiddler的内置响应
- 自定义响应

![09.png](/image/浏览器渲染/1625127201420-1ea7fb64-dc6b-46c6-a853-dfefc428494a.png)

### 4、composer

接口测试工具，发包工具

# **7、抓取HTTPS**

![07.png](/image/浏览器渲染/1625108801635-f1ed568d-9b70-4987-b3f6-ad91cfee9d2a.png)

![08.png](/image/浏览器渲染/1625108919671-72dd2d61-ce80-46c5-bb1b-ed6cf2f16e06.png)

### 1、对淘宝进行抓包

![09.png](/image/浏览器渲染/1625109022558-a9288ded-c031-46bd-864f-ce7e9e36bb87.png)
