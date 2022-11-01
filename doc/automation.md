
tips:
1. 代码中使用了async eslint报错
![image.png](https://bce.bdstatic.com/doc/bd-idg-clw-xiaoduzhushou/Paper/image_5226b42.png)
解决方法：
```
module.exports = {
    ......
    parserOptions: {
        ecmaVersion: 8 // async、 await是一个ECMAScript 2017功能,所以需要设置ecmaVersion: 8
    }
    ......
```
2. vscode 设置默认使用四个缩进
```
    "editor.tabSize": 4,
    "editor.bracketPairColorization.enabled": true,
    "editor.detectIndentation": false,
```
3. 设置eslint未生效
> 重启一下vscode