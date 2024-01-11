---
title: express
date: 2024-01-10 10:42:51
categories:
- 后端
- express
tags:
- express
- nodejs
typora-root-url: ..\..
---

## 安装

```
npm i express@4.17.1
```

```shell
npm i -g nodemon
# 使用nodemon启动可以监听index.js的变化实现热更新
nodemon index.js
```

## 基本使用

### 创建服务器

```js
const express = require('express');
const app = express()

app.listen(8000, () => {
    console.log('server running at http://127.0.0.1:8000')
})

```

### 监听请求

```js
app.get('/usr', (req, res) => {
    res.send('get请求成功')
})

app.post('/usr', (req, res) => {
    res.send('post请求成功')
})
```

### 获取url中携带的查询参数

```js
app.get('/usr', (req, res) => {
    // req.query 默认是一个空对象
    // 客户端使用 ?name=zs&age=20 这种查询字符串形式，发送到服务器的参数
    // 可以通过 req.query 对象访问到，例如:
    // req .query.name
    res.send(req.query)
})
```

### 获取url中的动态参数

```js
app.get('/usr/:id', (req, res) => {
    // req.params 默认是一个空对象
    //里面存放着通过 : 动态匹配到的参数值
    console.log(req.params)
    res.send(req.params)
})
```

## 托管静态资源

### express.static

express提供了一个非常好用的函数，叫做 express.static ()，通过它，我们可以 非常方便地创建 一个 静态资源服务器
例如，通过如下代码就可以将 public 目录下的图片、 CSS 文件、 JavaScript 文件对外开放访问了：

```js
app.use(express.static('public'))
```

现在，你就可以访问
public 目录中的所有文件了：
http://localhost:3000/images/bg.jpg
http://localhost:3000/css/style.css
http://localhost:3000/js/login.js

> 注意：
> Express 在 指定的 静态目录中查找文件，并对外提供资源的访问路径。
> 因此，存放静态文件的目录名不会出现在 URL 中 。

### 托管多个静态资源目录

```js
app.use(express.static('public'))
app.use(express.static('files'))
```

访问静态资源文件时，express.static () 函数会根据目录的添加顺序查找所需的文件。

### 挂载路径前缀

如果希望在托管的静态资源访问路径 之前， 挂载路径前缀 ，则可以使用如下的方式：

```js
app.use('/public',express.static('public'))
```

现在，你就可以通过带有
/public 前缀地址来访问 public 目录中的文件了：
http://localhost:3000/public /images/kitten.jpg
http://localhost:3000/public /css/style.css
http://localhost:3000/public /js/app.js

## Express路由

为了 方便对路由进行模块化的管理 Express 不建议 将路由直接挂载到 app 上，而是推荐将路由抽离为单独的模块。 将路由抽离为单独模块的步骤如下：
> ① 创建路由模块对应的.js 文件
② 调用 express.Router () 函数创建路由对象
③ 向路由对象上挂载具体的路由
④ 使用 module.exports 向外共享路由对象
⑤ 使用 app.use () 函数注册路由模块

### 创建路由模块
```js
const express = require('express')
const router = express.Router();

router.get('/user/list', (req, res) => {
    res.send('get 请求')

})
router.post('/user/add', (req, res) => {
    res.send('post 请求')
})
module.exports = router
```
### 注册路由模块
```js
const router = require('./router');
// 使用app.use()注册路由，并统一添加访问前缀/api
app.use('/api', router)
```
## Express中间件
### 概念
中间件（Middleware），特指 业务流程 的 中间处理环节。

Express 中间件的 调用流程：
当一个请求到达Express 的服务器之后，可以连续调用多个中间件，从而对这次请求进行 预处理 。

![image-20240111111033749](/image/express/image-20240111111033749.png)

#### Express 中间件的 格式

Express的中间件， 本质 上就是一个 function 处理函数 Express 中间件的格式如下：

![image-20240111111151665](/image/express/image-20240111111151665.png)

注意：中间件函数的形参列表中，必须包含 next 参数 。而路由处理函数中只包含 req 和 res 。

next 函数的作用
next函数 是实现 多个中间件连续调用 的关键，它表示把流转关系 转交 给下一个 中间件 或 路由 。

![image-20240111111307482](/image/express/image-20240111111307482.png)

### 使用

定义 中间件函数

可以通过如下的方式，定义一个最简单的中间件函数：

```js
const mw = (req,res,next)=>{
    console.log('这是一个中间件函数')
    next()
}
```

中间件使用

```js
// 全局中间件
app.use(mw)
// 局部中间件
app.use('/api', mw, router)
app.use('/usr', mw, (req,res)=>{
    res.send('usr请求')
})
// 多个局部中间件
app.use('/usr', [mw1,mw2], (req,res)=>{
    res.send('usr请求')
})
app.use('/usr', mw1, mw2, (req,res)=>{
    res.send('usr请求')
})
```

了解中间件的 5 个 使用注意事项：

>① 一定要在 路由之前 注册中间件
>② 客户端发送过来的请求， 可以连续调用多个 中间件进行处理
>③ 执行完中间件的业务代码之后， 不要忘记调用 next() 函数
>④ 为了 防止代码逻辑混乱 ，调用 next() 函数后不要再写额外的代码
>⑤ 连续调用多个中间件时，多个中间件之间， 共享 req 和 res 对象

### 分类

为了方便大家理解 和 记忆 中间件的使用， Express 官方把 常见的中间件用法 ，分成了 5 大类 ，分别是

>① 应用级别 的中间件
>② 路由级别 的中间件
>③ 错误级别 的中间件
>④ Express 内置 的中间件
>⑤ 第三方 的中间件

#### 应用级别中间件

通过app.use () 或 app.get () 或 app.post () 绑定到 app 实例上的中间件 ，叫做应用级别的中间件，代码示例如下

![image-20240111112544892](/image/express/image-20240111112544892.png)

#### 路由级别 的中间件

绑定到express.Router () 实例上的中间件，叫做路由级别的中间件。它的用法和应用级别中间件没有任何区别。只不
过， 应用级别中间件是绑定到 app 实例上 路由级别中间件绑定到 router 实例上 ，代码示例如下

![image-20240111112619145](/image/express/image-20240111112619145.png)

#### 错误级别 的中间件

错误级别中间件的
作用 ：专门用来捕获整个项目中发生的异常错误，从而防止项目异常崩溃的问题。
格式：错误级别中间件的 function 处理函数中， 必须有 4 个形参 ，形参顺序从前到后，分别是 err , req, res,next 。

![image-20240111112723904](/image/express/image-20240111112723904.png)

> 注意：错误级别的中间件，必须注册在所有路由之后

#### Express 内置 的中间件
自Express 4.16.0 版本开始， Express 内置了 3 个 常用的中间件，极大的提高了 Express 项目的开发效率和体验：

> ① express.static 快速托管静态资源的内置中间件，例如： HTML 文件、图片、 CSS 样式等（无兼容性）
> ② express.json 解析 JSON 格式的请求体数据（ 有兼容性 ，仅在 4.16.0+ 版本中可用）
> ③ express.urlencoded 解析 URL encoded 格式的请求体数据（ 有兼容性 ，仅在 4.16.0+ 版本中可用）

![image-20240111112854997](/image/express/image-20240111112854997.png)

#### 第三方 的中间件

非Express 官方内置的，而是由第三方开发出来的中间件，叫做第三方中间件。在项目中，大家可以 按需下载 并 配置第三方中间件，从而提高项目的开发效率。
例如：在express@4.16.0 之前的版本中，经常使用 body parser 这个第三方中间件，来解析请求体数据。使用步骤如下：
①运行 npm install body parser 安装中间件
②使用 require 导入中间件
③调用 app.use () 注册并使用中间件
注意：Express 内置的 express.urlencoded 中间件，就是基于 body parser 这个第三方中间件进一步封装出来的。

## 接口跨域

刚才编写的 GET 和 POST 接口，存在一个很严重的问题： 不支持跨域请求 。
解决接口跨域问题的方案主要有两种：
① CORS （主流的解决方案 推荐使用）
② JSONP （有缺陷的解决方案：只支持 GET 请求）

### 使用 cors 中间件 解决跨域问题

cors是 Express 的一个第三方中间件。通过安装和配置 cors 中间件，可以很方便地解决跨域问题。
使用步骤分为如下3 步：

> ①运行 npm install cors 安装中间件
> ②使用 const cors =require ('cors') 导入中间件
> ③在路由之前 调用 app.use(cors()) 配置中间件

#### 什么是 CORS

CORS (Cross Origin Resource Sharing ，跨域资源共享）由一系列 HTTP 响应头 组成， 这些 HTTP 响应头决定浏览器是否阻止前端 JS 代码跨域获取资源 。

浏览器的同源安全策略 默认会阻止网页“跨域”获取资源。但如果接口服务器 配置了 CORS 相关的 HTTP 响应头就可以 解除浏览器端的跨域访问限制 。

![image-20240111153152224](/image/express/image-20240111153152224.png)

![image-20240111153200412](/image/express/image-20240111153200412.png)

#### CORS 的注意事项

① CORS 主要在 服务器端 进行配置。客户端浏览器 无须做任何额外的配置 ，即可请求开启了 CORS 的接口。
② CORS 在浏览器中 有兼容性 。只有支持 XMLHttpRequest Level2 的浏览器，才能正常访问开启了 CORS 的服务端接口（例如： IE10+ 、 Chrome4+ 、FireFox3.5+）。

#### CORS 响应头部 Access-Control-Allow-Origin

响应头部中可以携带一个Access-Control-Allow-Origin 字段，其语法如下:

![image-20240111153352792](/image/express/image-20240111153352792.png)

其中，origin 参数的值指定了 允许访问该资源的外域 URL 。

例如，下面的字段值将只允许 来自 http://itcast.cn 的请求：

![image-20240111153452258](/image/express/image-20240111153452258.png)

如果指定了Access-Control-Allow-Origin 字段的值为 通配符 *，表示允许来自任何域的请求

#### CORS 响应头部 Access-Control-Allow-Headers

默认情况下，CORS 仅 支持 客户端向服务器 发送如下的 9 个 请求头
Accept、 Accept Language 、 Content-Language 、 DPR 、 Downlink 、 Save-Data 、 Viewport-Width 、 Width、Content-Type （值仅限于 text/plain 、 multipart/form-data 、 application/x-www-form-urlencoded 三者之一）
如果客户端向服务器发送了额外的请求头信息 ，则需要在 服务器端 ，通过 Access-Control-Allow-Headers 对额外的请求头进行声明 ，否则这次请求会失败

![image-20240111153719301](/image/express/image-20240111153719301.png)

#### CORS 响应头部 Access-Control-Allow-Methods

默认情况下，CORS 仅支持客户端发起 GET 、 POST 、 HEAD 请求。
如果客户端希望通过PUT 、 DELETE 等方式请求服务器的资源，则需要在服务器端，通过 Access-Control-Alow-Methods来 指明实际请求所允许使用的 HTTP 方法 。

示例代码如下：

![image-20240111153809529](/image/express/image-20240111153809529.png)

#### CORS 请求的分类

客户端在请求
CORS 接口时，根据 请求方式 和 请求头 的不同，可以将 CORS 的请求分为 两大类 ，分别是
① 简单请求
② 预检请求

>简单请求
>
>同时满足以下两大条件的请求，就属于简单请求：
>①请求方式 GET 、 POST 、 HEAD 三者之一
>②HTTP 头部信息 不超过以下几种字段： 无自定义头部字段 、 Accept 、 Accept-Language 、 Content Language 、 DPR 、Downlink 、 Save-Data 、 Viewport-Width 、 Width 、 Content-Type （只有三个值 application/x www-form-urlencoded 、 multipart/form-data 、 text/plain）
>
>预检请求
>
>只要符合以下任何一个条件的请求，都需要进行预检请求：
>① 请求方式为 GET 、 POST 、 HEAD 之外的请求 Method 类型
>② 请求头中 包含自定义头部字段
>③ 向服务器发送 了 application/json 格式的数据在浏览器与服务器正式通信之前，浏览器会先发送 OPTION 请求进行预检，以获知服务器是否允许该实际请求 ，所以这一次的 OPTION 请求称为“预检请求”。 服务器成功响应预检请求后，才会发送真正的请求，并且携带真实数据 。

### jsonp接口

概念：浏览器端通过 <script> 标签的 src 属性，请求服务器上的数据，同时，服务器返回一个函数的调用。这种请求数据的方式叫做 JSONP 。
特点：
① JSONP 不属于真正的 Ajax 请求，因为它没有使用 XMLHttpRequest 这个对象。
② SONP 仅支持 GET 请求，不支持 POST 、 PUT 、 DELETE 等请求。

#### 实现 JSONP 接口的步骤

>① 获取 客户端发送过来的 回调函数的名字
>② 得到要 通过 JSONP 形式 发送给客户端的数据
>③ 根据前两步得到的数据， 拼接出一个函数调用的字符串
>④ 把上一步拼接得到的字符串，响应给客户端的 <script> 标签进行解析执行

#### 服务器代码实现

```js
app.get('/api/jsonp', (req, res) => {
    // 1.获取客户端发送过来的回调函数的名字
    const funcName = req.query.callback
    // 2.得到要通过 JSONP 形式发送给客户端的数据
    const data = { name: 'zs' , age: 22 }
    // 3.根据前两步得到的数据，拼接出一个函数调用的字符串
    const scriptStr = `${funcName}(${JSON.stringify(data)})`
    // 4.把上一步拼接得到的字符串，响应给客户端的 <script> 标签进行解析执行
    res.send(scriptStr)
})
```

#### 在网页实现jsonp

调用$.ajax() 函数， 提供 JSONP 的配置选项 ，从而发起 JSONP 请求，示例代码如下：

```js
$('#btnJsonp').on('click', function () {
    $.ajax({
        method: 'GET',
        url: 'http://127.0.0.1/api/jsonp',
        dataType: 'jsonp',
        success: function (res) {
            console.log(res)
        }
    })
})
```

