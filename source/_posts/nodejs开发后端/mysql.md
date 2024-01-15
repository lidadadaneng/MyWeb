---
title: mysql
date: 2024-01-15 10:42:51
categories:
- 后端
- mysql
tags:
- express
- nodejs
typora-root-url: ..\..

---

## 常见数据库及分类

市面上的数据库有很多种，最常见的数据库有如下几个：

- MySQL 数据库（ 目前 使用最广泛 、 流行度最高 的开源免费数据库； Community + Enterprise
- Oracle 数据库（收费）
- SQL Server 数据库（收费）
- Mongodb 数据库（ Community + Enterprise

其中，MySQL 、 Oracle 、 SQL Server 属于 传统型数据库 （又叫做 关系型数据库 或 SQL 数据库 ），这三者的设计理念相同，用法比较类似。
而Mongodb 属于 新型数据库 （又叫做 非关系型数据库 或 NoSQL 数据库 ），它在一定程度上弥补了传统型数据库的缺陷。

## 使用 SQL 管理数据库

### 什么是 SQL

SQL（英文全称 Structured Query Language ）是结构化查询语言 ，专门用来访问和处理数据库的编程语言。能够让我们以编程的形式操作数据库里面的数据 。

> 三个关键点：
> ①SQL 是一门 数据库编程语言
> ②使用 SQL 语言编写出来的代码，叫做 SQL 语句
> ③SQL 语言 只能在关系型数据库中使用 （例如 MySQL 、 Oracle 、 SQL Server ）。非关系型数据库（例如 Mongodb）不支持 SQL 语言

### SQL的 SELECT 语句
SELECT 语句用于从表中查询数据 。执行的结果被存储在一个 结果表 中（称为 结果集 ）。语法格式如下：

```sql
-- * 是选取所有列的快捷方式
SELECT * FROM `users`
```

![image-20240115144113674](/image/express/image-20240115144113674.png)

如需获取名为 username " 和 password " 的列的内容（从名为 "users" 的数据库表），请使用下面的 SELECT 语句：

```sql
-- 多个列之间，使用英文逗号分割
SELECT username,password FROM users
```

![image-20240115144313030](/image/express/image-20240115144313030.png)

### SQL的 INSERT INTO 语句
INSERT INTO语句用于 向数据表中 插入新的数据行 ，语法格式如下

![image-20240115144441977](/image/express/image-20240115144441977.png)

向users 表中，插入一条 username 为 tony stark password 为 098123 的用户数据，示例如下：

```sql
INSERT INTO users (username,password,status) VALUES ('tony stark','098123',0)
```

### SQL的 UPDATE 语句
Update语句用于 修改表中的数据 。语法格式如下：

![image-20240115145030586](/image/express/image-20240115145030586.png)

UPDATE 示例 更新某一行中的一个列

```sql
UPDATE users SET password='888888' WHERE id=3
```

![image-20240115145204042](/image/express/image-20240115145204042.png)

更新某一行中的若干列

把users 表中 id 为 2 的 用户密码 和 用户状态 ，分别更新为 admin123 和 1 。示例如下：

```sql
UPDATE users SET password='888888', status=1 WHERE id=2
```

### SQL的 DELETE 语句
DELETE语句用于删除表中的行。语法格式如下：

![image-20240115145458830](/image/express/image-20240115145458830.png)

从 users 表中，删除 id 为 4 的用户，示例如下：

```sql
DELETE FROM users WHERE id=4
```

### SQL的 WHERE 子句
WHERE子句用于 限定选择的标准 。在 SELECT 、 UPDATE 、 DELETE 语句中， 皆可使用 WHERE 子句来限定选择的标准。

![image-20240115145659157](/image/express/image-20240115145659157.png)

可在 WHERE 子句中使用的 运算符

下面的运算符可在WHERE 子句中使用，用来限定选择的标准：

| 操作符   | 描述         |
| -------- | ------------ |
| =        | 等于         |
| <>或者!= | 不等于       |
| >        | 大于         |
| <        | 小于         |
| >=       | 大于等于     |
| <=       | 小于等于     |
| BETWEEN  | 在某个范围内 |
| LIKE     | 搜索某种模式 |

> 注意：在某些版本的SQL 中，操作符 <> 可以写为

可以通过WHERE 子句来限定 SELECT 的查询条件：

```sql
-- 查询status为1的所有用户
SELECT * FROM users WHERE status=1
-- 查询id大于2的所有用户
SELECT * FROM users WHERE id>2
-- 查询username不等于admin的所有用户
SELECT * FROM users WHERE username <> 'admin'
```

### SQL的 AND 和 OR 运算符

AND和 OR 可 在 WHERE 子语句 中 把两个或多个条件结合起来 。
`AND`表示**必须同时满足多个条件**，相当于 JavaScript 中的 && 运算符，例如` if (a !== 10 && a !== 20)`
`OR`表示 **只要满足任意一个条件即可**，相当于 JavaScript 中的 || 运算符，例如 `if(a !== 10 || a !== 20)`

使用AND 来显示所有 status 为 0 ，并且 id 小于 3 的用户：

```sql
SELECT * FROM users WHERE id<3 AND status=0
```

使用OR 来显示所有 status 为 1 ，或者 username 为 zs 的用户：

```sql
SELECT * FROM users WHERE username='zs' OR status=1
```

### SQL的 ORDER BY 子句
> ORDER BY 语句用于 根据指定的列 对结果集进行排序 。
> ORDER BY 语句 默认 按照 升序 对记录进行排序。
> 如果您希望按照降序 对记录进行排序，可以使用 DESC 关键字。

ORDER BY子句 升序排序

对 users 表中的数据，按照 status 字段进行升序排序，示例如下：

```sql
-- 注意：如下两条sql是等价的
-- 因为ORDER BY 默认进行升序排序
-- 其中，ASC 关键字代表升序排序
SELECT * FROM users ORDER BY status
SELECT * FROM users ORDER BY status ASC
```

![image-20240115151340804](/image/express/image-20240115151340804.png)

ORDER BY子句 降序排序

对users 表中的数据，按照 id 字段进行降序排序，示例如下：

```sql
SELECT * FROM users ORDER BY id DESC
```

ORDER BY子句 多重排序

对users 表中的数据，先按照 status 字段进行 降序排序 ，再按照 username 的 字母顺序 ，进行 升序排序 ，示例如下

```sql
SELECT * FROM users ORDER BY status DESC, username ASC
```

### SQL的 COUNT(*) 函数
COUNT(*)函数用于返回 查询结果的 总数据条数 ，语法格式如下

![image-20240115151641460](/image/express/image-20240115151641460.png)

查询users 表中 status 为 0 的总数据条数：

```sql
SELECT COUNT(*) FROM users WHERE status=0 
```

使用 AS 为列 设置别名

```sql
SELECT COUNT(*) AS total FROM users WHERE status=0 
```



## 在项目中操作MySQL

在项目中操作数据库的步骤
①安装操作 MySQL 数据库的第三方模块（ mysql）
②通过 mysql 模块 连接到 MySQL 数据库
③通过 mysql 模块 执行 SQL 语句

![image-20240115151933598](/image/express/image-20240115151933598.png)

#### 安装 mysql 模块

```shell
npm i mysql
```

#### 配置 mysql 模块

在使用mysql 模块操作 MySQL 数据库之前， 必须先对 mysql 模块进行必要的配置 ，主要的配置步骤如下

```js
// 导入mysql 模块
const mysql = require('mysql')
// 建立与MySQL数据的连接
const db = mysql.createConnection({
    host: '127.0.0.1', //数据库ip地址
    user: 'root', // 用户名
    password: 'admin123', // 密码
    database: 'demo' //数据库名称
})
```

#### 测试 mysql 模块能否正常工作

调用db.query () 函数，指定要执行的 SQL 语句，通过回调函数拿到执行的结果：

```js
// 检测mysql模块能否正常工作
db.query('SELECT 1',(err,result)=>{
    if(err)return console.log(err)
    // 打印出[ RowDataPacket { '1': 1 } ]代表连接成功
    console.log(result)
})
```

#### 使用 mysql 模块操作 MySQL 数据库

查询users 表中所有的数据：

```js
db.query('SELECT * FROM users',(err,result)=>{
    if(err)return console.log(err)
    console.log(result)
})
```

向users 表中新增数据， 其中 username 为 Spider Man password 为 pcc321 。示例代码如下：

```js
const user = {username: 'Spider-man', password: 'pcc321', status: 1}
// 待执行的sql语句，其中英文?为占位符
const sqlStr = 'INSERT INTO users (username,password,status) VALUES (?,?,?)'
// 使用数组形式，依次为?占位符指定具体的值
db.query(sqlStr, [user.username, user.password, user.status], (err, result) => {
    if (err) return console.log(err.message)
    if(result.affectedRows === 1) console.log('插入数据成功')
})
```

插入数据的 便捷方式

```js
const user = {username: 'Spider-man', password: 'pcc321', status: 1}
// 待执行的sql语句，其中英文?为占位符
const sqlStr = 'INSERT INTO users SET ?'
// 使用数组形式，依次为?占位符指定具体的值
db.query(sqlStr, user, (err, result) => {
    if (err) return console.log(err.message)
    if(result.affectedRows === 1) console.log('插入数据成功')
})
```

可以通过如下方式，更新表中的数据：

```js
// 要更新的数据对象
const user = {password: "pcc321", id: 1}
// 待执行的sql语句，其中英文?为占位符
const sqlStr = 'UPDATE users SET password=? WHERE id=?'
// 使用数组形式，依次为?占位符指定具体的值
db.query(sqlStr, [user.password, user.id], (err, result) => {
    if (err) return console.log(err.message)
    if (result.affectedRows === 1) console.log('更新数据成功')
})
```

更新数据的 便捷方式

更新表数据时，如果数据对象的每个属性 和 数据表的字段 一一对应 ，则可以通过如下方式快速更新表数据

```js
// 要更新的数据对象
const user = { id: 6,username:'分从四面八方来',password: '我爱分分爱我', status: 1 }
// 待执行的sql语句，其中英文?为占位符
const sqlStr = 'UPDATE users SET ? WHERE id=?'
// 使用数组形式，依次为?占位符指定具体的值
db.query(sqlStr, [user, user.id], (err, result) => {
    if (err) return console.log(err.message)
    if (result.affectedRows === 1) console.log('更新数据成功')
})
```

删除数据

在删除数据时，推荐根据id 这样的唯一标识，来删除对应的数据。示例如下：

```js
// 待执行的sql语句，其中英文?为占位符
const sqlStr = 'DELETE FROM users WHERE id=?'
// 使用数组形式，依次为?占位符指定具体的值
// 如果SQL语句中只有一个占位符，则可以省略数据
db.query(sqlStr, 6, (err, result) => {
    if (err) return console.log(err.message)
    if (result.affectedRows === 1) console.log('删除数据成功')
})
```

标记删除

使用DELETE 语句，会把真正的把数据从表中删除掉。为了保险起见， 推荐使用 标记删除 的形式，来 模拟删除的动作 。所谓的标记删除，就是在表中设置类似于status 这样的 状态字段 ，来 标记 当前这条数据是否被删除。当用户执行了删除的动作时，我们并没有执行DELETE 语句把数据删除掉，而是执行了 UPDATE 语句，将这条数据对应的 status 字段标记为删除即可。

```js
// 标记删除: 使用 UPDATE 语替代 DELETE 语，只更新数据的状态，并没有真正删除
db.query('UPDATE USERS SET status=1 WHERE id=?', 5,(err, results) => {
    if (err) return console.log(err.message)
    if (results.affectedRows === 1)  console.log('删除数据成功!')
})
```



