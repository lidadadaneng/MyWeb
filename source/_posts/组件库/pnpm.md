---
title: pnpm
date: 2023-06-14 10:42:51
categories:
- 前端
- 组件库必备知识
tags:
- pnpm
- 组件库
typora-root-url: ..\..

---

# pnpm学习

## 1、pnpm是什么？

现代的包管理工具 pnpm（ performant npm ），意思是高性能的 npm
它由 npm/yarn 衍生而来，但却解决了 npm/yarn 内部潜在的 bug，并且极大了地优化了性能

## 2、特性概览

### （1）速度快

![img](/image/组件库/8349b1f20bac4c70b11532672c71a599.png)


官方的benchmark 数据是这样的，但是实际使用发现pnpm的第一次下载包速度跟yarn是差不多的，其优势体现在第二次下载相同的包更快

### （2）高效利用磁盘空间

pnpm 内部使用基于内容寻址的文件系统来存储磁盘上所有的文件，这个文件系统出色的地方在于
1、不会重复安装同一个包。用 npm/yarn 的时候，如果 100 个项目都依赖 lodash，那么 lodash 很可能就被安装了 100 次，磁盘中就有 100 个地方写入了这部分代码。但在使用 pnpm 只会安装一次，磁盘中只有一个地方写入，后面再次使用都会直接使用 hardlink(硬链接）
2、即使一个包的不同版本，pnpm 也会极大程度地复用之前版本的代码。举个例子，比如 lodash 有 100 个文件，更新版本之后多了一个文件，那么磁盘当中并不会重新写入 101 个文件，而是保留原来的 100 个文件的 hardlink，仅仅写入那一个新增的文件。

### （3）*支持monorepo

随着前端工程的日益复杂，越来越多的项目开始使用 monorepo。之前对于多个项目的管理，我们一般都是使用多个 git 仓库，但 monorepo 的宗旨就是用一个 git 仓库来管理多个子项目，所有的子项目都存放在根目录的packages目录下，那么一个子项目就代表一个package。

## 3、pnpm依赖原理

### 1、npm、yarn安装包的问题

在 pnpm 出现以前，npm 和 yarn 为了提高包的复用率，都采用了扁平化的装包策略。扁平化的安装方式会导致我们的 node_modules 文件夹和 package.json 存在很大的出入，比如你install一个包 express，但是你的node_modules下会有很多包

![在这里插入图片描述](/image/组件库/10855e2767974357a693477637796903.png)

这个时候会有一些问题
**（1）幽灵依赖**

从目前的包引用方式来说，inport的时候我们会从node_modules的文件夹中寻找，按照上面的图中所示，如果我们在package.json中没有accepts，其实我们也是可以引用到的，因为她确实存在，这时候我们访问的就是未申明npm包，如果某一天express主包不再依赖accepts，这个时候项目就会有依赖缺失的问题。 我们把这种主包依赖的子包，未被申明而在项目中使用，可以理解成是主包夹带的包，我们称之为 幽灵依赖。
**（2）包版本的不确定性**
这个很好理解，如果A、B两个主包都依赖accepts包，但是A依赖accepts@1.0，B依赖accepts@2.0 ，那node_modules下的扁平结构是展示1.0 还是 2.0 呢？目前的方式是谁后安装的谁就显示。 这种不确定性在开发中引起的问题也不在少数 「别人用这个包可以解决这个问题，但是我安装这个包就不能解决」，往往就是这个原因导致的。
**（3）依赖重复安装**
这个也很好理解，AB都依赖accepts，依赖不同的版本，无论node_modules的顶层提升了哪个版本，这个包都是会被安装两次的。

### 2、pnpm的安装包方式

同样的，使用pnpm安装一个express，安装结构如下

![在这里插入图片描述](/image/组件库/2682122233c841e4910e842c29dd3708.png)

可以看到 node_modules 结构非常清晰，但是这个 express 文件夹只是一个软链接, 它的真正存储的地方在图中的 .pnpm 文件夹中
我们看一下pnpm官方对这一现象的图示说明：

![在这里插入图片描述](/image/组件库/438d05f14fff446880f53cbdfc7fff29.png)


顶级外层来看，格式很清晰，.pnpm中也是嵌套的。这是因为pnpm的node_modules布局使用的是符号链接来创建依赖关系的嵌套结构。.pnpm内部的每个包中的每个文件都是只用硬链接指向了.pnpm store 中的文件
这样的好处就是会让我们的node_modules很清晰，内部的包可以和package.json中的依赖对应起来，一目了然，我们安装什么里面就有什么
这样幽灵依赖的问题就解决了，包版本不确定性的问题也就解决了。毕竟顶层就只有我们手动安装的包，其他依赖包都收在.pnpm中。这样无论是哪个版本都会平铺在这里供你使用。 这个平铺的方式就是通过链接的形式进行引用

问题是上面的软链接、硬链接是啥呢？简单说明一下

> 软链接：类似windows系统的快捷方式；软链接里面存放的是源文件的路径，指向源文件；
> 硬链接：是计算机文件系统中的多个文件平等地共享同一个文件存储单元（如MFT条目、inode），可以实现多对一的关系，pnpm主要利用的是这一特性，这就很容易说明多个项目用到同一个包，就不用再重复下载包了，只需要管理好.pnpm
> store中的对应源文件就可以了

### 3、日常使用

pnpm 使用命令和之前 npm/yarn 差不多，甚至可以无缝迁移到 pnpm 上来，常用命令主要是

> 1、pnpm install ：安装依赖
> 2、pnpm update ：更新依赖，根据指定的范围将包更新到最新版本，monorepo 项目中可以通过 --filter 来指定更新某个项目的某个包
> 3、pnpm uninstall ：删除依赖，根据指定的范围将包删除，monorepo 项目中可以通过 --filter 来指定删除某个项目的某个包
> 4、pnpm add：添加包
> 5、pnpm filter？

### 4、pnpm Demo演示
上述提到的filter到底是什么功用呢？结合以下项目具体阐述
**1、先配置最外层主目录结构**
pnpm-workspace.yaml 配置

```json
1) pnpm-workspace.yaml 配置
      packages:
      - "packages/**"
```

意思是定义pnpm的workspace空间，项目的多包文件入口是packages

**2、在packages中创建多个项目，各个项目是独立的，你可以创建vue、react项目、方法库等，各项目是独立的，但是依赖包可以进行共享**

我现在的目录结构如下：

```json
PNPMDEMO
	├── package.json
	├── packages
	│   ├── components
	│   │   ├── index.js
	│   │   └── package.json
	│   ├── reactApp
	│   │   ├── public
	│   │   └── src
	│   │   └── .....
	│   │   └── package.json
	│   │   └── vite.config.js
	│   ├── utils
	│   │   ├── index.js
	│   │   └── package.json
	├── pnpm-lock.yaml
	└── pnpm-workspace.yaml
```

**3、编写每个项目的package.json，其实主要是编写一下名称，方便以后使用**
（我在utils/packages.json中安装了dayjs，在utils/packages.json安装了lodash）

```json
{
		"name": "@packages/utils",
		"version": "2.0.0",
		"description": "",
		"main": "index.js",
		"scripts": {
			"test": "echo "Error: no test specified" && exit 1"
		},
		"keywords": [],
		"author": "",
		"type": "module",
		"license": "ISC",
		"dependencies": {
			"dayjs": "^1.11.5"
		}
	}
```

**4、安装依赖**
1）在根目录下安装依赖的话，这个依赖可以在所有的packages中使用
2）package下各项目安装依赖，问题来了? 我们需要cd到package的所在目录嘛?答案是:不需要的,可以通过pnpm强大的filter命令执行操作

### 5、命令

在根目录可以进行总目录的命令操作，也可对packages下的各项目进行整体命令操作

```shell
pnpm -w <package_selector>
pnpm --filter <package_selector>
```

```shell
1）全局安装，下面各项目直接可以调用总包 ：pnpm -w add shortid
2）对packages下的各项目执行打包
"scripts": {
	"test": "echo "Error: no test specified" && exit 1",
	"build": "pnpm --filter * build"
},
3）对packages下某个项目进行增加依赖操作
例如：在@packages/components中安装lodash，在@packages/utils中安装一个dayjs
pnpm --filter @packages/components add lodash
pnpm --filter @packages/utils add dayjs
```

### 6、实例场景

在utils项目内定义一个方法，在reactAPP进行引用
1、在utils项目内定义一个方法

```js
import dayjs from "dayjs";
export const formatDay = () => {
	return dayjs().format('YYYY-MM-DD')
}
```
2、 在根目录下执行`pnpm -F @packages/react-app add @packages/utils@*`,
表示@packages/components安装@packages/utils，其中的@*表示默认同步最新版本，省去每次都要同步最新版本的问题

```json
完成后在reactAPP的packages.json中是这样的
    {
      "name": "@packages/react-app",
      "private": true,
      "version": "0.0.0",
      "type": "module",
      "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
      },
      "dependencies": {
        "@packages/utils": "workspace:*", //引入的utils的包
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
      },
      "devDependencies": {
        "@types/react": "^18.0.17",
        "@types/react-dom": "^18.0.6",
        "@vitejs/plugin-react": "^2.1.0",
        "vite": "^3.1.0"
      }
    }
```

3、 在reactApp下的调用utils定义的方法

```js
  import { useState } from 'react'
    import {formatDay,formatMth} from '@packages/utils'
    import './App.css'
    function App() {
      console.log(formatMth());
      return (

        <div className="App">
          {formatDay()}
        </div>

     )
    }
    export default App
```

7、包提升
就是实现在packages下的某个项目中引入一个第三方库，将此第三方库提升到目录层，其他packages下的所有项目都可以使用此第三方库
1）在components项目中引入lodash
2）配置.npmrc文件 `public-hoist-pattern[]=lodash`
3）执行`pnpm install`,在reactApp下即可使用lodash的方法