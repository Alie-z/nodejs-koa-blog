<p align="center"><a href="http://www.boblog.com" target="_blank" rel="noopener noreferrer"><img width="234" src="https://mbs1.bdstatic.com/searchbox/mappconsole/image/20221026/cd3f97e0-eb66-4d64-a986-3939bb5e09ef.png" alt="logo"></a></p>

项目fork的https://github.com/lfb/nodejs-koa-blog
大家支持原作者，本项目新增了一些爬虫、鉴权等，供学习和探索使用

线上地址：http://blog.at-will.cn/

## 一、这是个什么的项目？
实战开发的一套完整的博客项目网站：
- Node.js + Koa2 + MySQL 开发的一套完整 RESTful API
- Vue.js + element-ui 管理后台
- SSR Nuxtjs 前台服务端渲染


## 二、项目包含什么功能？

[![koa](https://img.shields.io/badge/koa-%5E2.7.0-brightgreen.svg) ](https://www.npmjs.com/package/koa)
[![koa-router](https://img.shields.io/badge/koa--router-%5E7.4.0-brightgreen.svg)](https://www.npmjs.com/package/koa-router)
[![sequelize](https://img.shields.io/badge/sequelize-%5E5.6.1-brightgreen.svg)](https://www.npmjs.com/package/sequelize)
[![mysql2](https://img.shields.io/badge/mysql2-%5E1.6.5-brightgreen.svg)](https://www.npmjs.com/package/mysql2)

### 2.1.Node.js Koa2服务端 RESTful API
- 管理员管理
- 用户管理
- 文章管理
- 分类管理
- 评论管理
- 回复管理
- 爬虫

### 2.2.优势
- 使用精小而强大的 Node.js Koa2 框架做服务端 API 接口。
- 前端既有服务端渲染，也有前后端分离，且做了大量的优化工作，前端展示网站打开快。

### 2.4.知识点
- 服务端：`Node.js, Koa, MySQL, Sequelize`
- 前端服务端渲染：`Nuxt.js, Markdown`
- 后端管理系统：`Vue.js, element-ui, Markdown`
- 性能优化
- 非常适合想用 `Node.js Koa2` 做网站的朋友，相信你一定能学到知识。

## 三、如何学习？
### 3.1.克隆项目
首先使克隆项目，然后进入项目根目录使用命令安装包，最后命令启动项目，代码会根据模型自动创建数据库表的。
```
# 克隆项目代码
$ git clone https://github.com/Alie-z/nodejs-koa-blog
```

### 3.2.数据库
启动项目前一定要在创建好 `boblog` 数据库，以下是执行数据库命令：
```
# 登录数据库
$ mysql -uroot -p密码

# 创建 boblog 数据库
$ CREATE DATABASE IF NOT EXISTS boblog DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3.3.修改 Koa2 项目数据库配置
请在根目录下的 [|——config/config.js](https://github.com/LFB/nodejs-koa-blog/blob/master/config/config.js) 文件下修改您本地的数据库名字（`boblog`）和数据库密码 ( `password` )。

根目录都是 Node.js + Koa2 API 开发源代码，重点是 app 文件夹下的 api 开发；根目录下的 frontend-boblog 文件夹下都是前端网站项目源代码；根目录下的 admin 文件夹下都是后台管理系统的源代码。

以下是启动服务端项目的操作命令：
```
# 进入项目根目录
$ cd nodejs-koa-blog

# 安装依赖包
$ npm install 或者 yarn install

# 启动 Node.js Koa2 项目
$ npm run dev 或者 yarn dev
```

打开浏览器输入回车：http://localhost:5000 可以看到服务端渲染的前端网站，当然可能该网站是个空数据网站，可以查看目录下的 `./app/api/v1` 下的接口或者看 doc 目录下的 markdown 接口文档，在 postman 测试接口。


以下是启动后台管理系统的操作命令：
```
# 启动后台管理系统
1. 在根目录下进入admin项目：cd admin，
2. 安装包，执行: npm install 或者 yarn install 命令，
3. 启动服务: npm run dev 或者 yarn dev; 浏览器打开：http://localhost:9528/ 即可以访问。
```

## 五、 服务器部署Node项目、Vue spa静态项目、ssr项目
- [本项目的部署地址](http://blog.at-will.cn/article?id=1)
- [csdn地址](https://blog.csdn.net/zm06201118/article/details/127576999)

## 六、 从零到一实现自动化部署
- [本项目的部署地址](http://blog.at-will.cn/article?id=2)
- [csdn地址](https://blog.csdn.net/zm06201118/article/details/127665682)

## 七、 Node koa2 + vue 实现文件分片上传
- [本项目的部署地址](http://blog.at-will.cn/article?id=3)
- [csdn地址](https://blog.csdn.net/zm06201118/article/details/127752589)

## todo


