# 服务器部署Node项目、Vue spa静态项目、ssr项目

## 一、 准备一个服务器
> 我学习使用，买的腾讯轻量应用服务器￥198 4年 
![1.png](https://bce.bdstatic.com/doc/bd-idg-clw-xiaoduzhushou/Paper/1_7256117.png)

## 二、 linux环境搭建
1. Node (服务器预装了)
2. Nginx（服务器预装了）
3. git 具体查看[linux 安装git教程](https://blog.csdn.net/csdnerM/article/details/122100354)
4. MySql 具体查看[Linux 安装 MySQL 详细教程](https://cloud.tencent.com/developer/article/1902824)


## 三、 node部署
1. cd  /home/node/
2. git clone git@github.com:Alie-z/nodejs-koa-blog.git 或者 git clone https://github.com/Alie-z/nodejs-koa-blog.git
3. cd nodejs-koa-blog 
4. npm i ||  yarn  || pnpm i
5. mysql -uroot -p xxx 登陆mysql
6. 初始化mysql 创建数据库 CREATE DATABASE IF NOT EXISTS boblog DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
7. npm run start
![image.png](https://bce.bdstatic.com/doc/bd-idg-clw-xiaoduzhushou/Paper/image_8bde5a9.png)
8. postman 或者浏览器访问 ip + 端口 发现访问不了，是因为服务器防火墙没有开放对应端口
> 到服务器后台 防火墙>添加规则  填写自己的端口 确定 （顺便把mysql web要使用的端口也添加）
![image.png](https://bce.bdstatic.com/doc/bd-idg-clw-xiaoduzhushou/Paper/image_9e812ab.png)

9. 访问一个接口 http://119.91.139.245:9000/api/v1/category 
![image.png](https://bce.bdstatic.com/doc/bd-idg-clw-xiaoduzhushou/Paper/image_f45de68.png)
10. node部署大功告成


## 四、 spa静态项目部署
1.  cd /home/node/nodejs-koa-blog/admin-blog/
2. npm i ||  yarn  || pnpm i
3. npm run build:prod
4. 查看Nginx 配置路径  ps -aux|grep nginx
![image.png](https://bce.bdstatic.com/doc/bd-idg-clw-xiaoduzhushou/Paper/image_7fd8b3b.png)
5. cd /usr/local/lighthouse/softwares/nginx/conf
6. 新建文件夹 mkdir web
7. 新建文件 blob-admin.conf
```
server {
  listen       8081;  #端口
  server_name  119.91.139.245;  #域名或者IP
  location / {
    root   /home/node/nodejs-koa-blog/admin-blog/dist;  #静态文件的目录
    index  index.html index.htm; #入口文件
    try_files $uri $uri/ /index.html;
    # 首先尝试打开指定path的文件，如果文件不存在，则继续打开下一个文件，如果都打不开则返回500
    # 假设请求为http://www.baidu.com/test，则$uri为test
    # 访问时查找/$root/test文件没，如果不存在就尝试打开/$root/test/目录，如果还不存在就打开/index.html
  }
}
```
8. 编辑nginx.conf 加载web文件夹下的 .conf文件
```
cd ../   
vim nginx.conf

# 在最下面插入 
include web/*.conf;
# 保存退出

``` 
9. 查看配置文件是否正确 `nginx -t`
![image.png](https://bce.bdstatic.com/doc/bd-idg-clw-xiaoduzhushou/Paper/image_ff2f841.png)
10. 重启nginx `nginx -s reload `
11. 访问 http://119.91.139.245:8081/ 
![image.png](https://bce.bdstatic.com/doc/bd-idg-clw-xiaoduzhushou/Paper/image_eba061a.png)
12. spa静态项目部署大功告成

## 五、 ssr部署
1. cd /home/node/nodejs-koa-blog/frontend-boblog/
2. npm i ||  yarn  || pnpm i
3. npm run build
4. npm run start
5. cd /usr/local/lighthouse/softwares/nginx/conf/web
6. 新建文件 blob.conf
```
server {
    listen 8080;
    server_name 119.91.139.245;
    location / {
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Nginx-Proxy true;
        proxy_cache_bypass $http_upgrade;
        #反向代理到本机的nuxt node服务上
        proxy_pass http://localhost:3001/; 
    }
}
```
7. 查看配置文件是否正确 `nginx -t`
8. 重启nginx `nginx -s reload `
9. 访问 http://119.91.139.245:8080/ 
![image.png](https://bce.bdstatic.com/doc/bd-idg-clw-xiaoduzhushou/Paper/image_f3e61a4.png)
10. ssr项目部署大功告成

## 六、 踩坑
1. 使用命令mysql -uroot -p连接mysql数据库报错：error while loading shared libraries: libncurses.so.5: cannot open shared object file
>    - 没有libncurses.so.5，可能有libncurses.so不同版本的文件，使用命令 `find / -name 'libncurses*'`
>     - 查找到`/usr/lib/x86_64-linux-gnu/libncurses.so.6.2`
>     - 建立软链接 `ln -s libncurses.so.6.2 libncurses.so.5`
>     - 如果没有找到的话，使用yum或apt安装即可

2. error while loading shared libraries:libtinfo.so.5: cannot open shared object file
>     同上，先查找有没有其它版本，建立软链接

3. 部署后访问不了，一直以为是代码或者部署流程的原因，后来发现是防火墙端口没开启😭

4. 部署ssr的时候，因为ssr项目是启一个node服务，配置nginx的时候proxy_pass一直监听的是开发环境的端口，一直访问不了，后端发现端口不对，所以在nuxt.config.js 需要配置server的port、host，建议和开发环境的端口保持一直，减少心智负担😭
```
export default {
    ......
    server: {
        port: '3001',
        host: 'localhost'
    }
};

```

> 看完记得 [github](https://github.com/Alie-z/nodejs-koa-blog)点个star