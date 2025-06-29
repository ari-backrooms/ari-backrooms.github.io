# 欢迎来到ARI WIKI！

<em><b style="background:red;color:black;padding:.2rem .5rem;"> 前言:网站在5月28日被炸了一次qwq </b></em>

## ARI WIKI 是什么？
ARI WIKI 是一个简单的wiki网站，主要包括为后室、scp等内容提供资料和帮助。同时，ARI WIKI 还提供一些其他功能，会在后面提到。

当然，为了迎合wikidot成员，此网站还有给wikidot的链接：[https://ari-01.wikidot.com/](https://ari-01.wikidot.com/)

额外注意：本wiki与官方wiki平行，不以双方视角带入。

## ARI WIKI 账户登录注册指南

### 登录

1. 打开浏览器，打开网址，点击登录按钮。

2. 输入您的用户名和密码，然后点击登录。出现 LOGIN SUCCESS!  代表登录成功。而其他的代表登录失败，请检查您的用户名和密码是否正确。

### 注册

1. 打开浏览器，打开网址，点击注册按钮。

2. 输入您的用户名、密码和电子邮件地址，然后点击注册。

3. 您将收到一封电子邮件，请点击电子邮件中的链接以验证您的电子邮件地址。

## ARI WIKI 版式安装包

一般的，ARI网站中内置一款主版式，但您也可以使用自己的版式。以下为版式安装包及指南。

### 版式安装包
安装包主要位于 component-style: xxx 中，您可以在其中找到安装包。

### 版式安装指南

找到安装包后，点击一个带 .ars 的文件，然后点击安装，安装后，您就可以使用这个版式了。

你可以在任意页面右键找到安装的版式。

注意：后缀为.css的文件是引用时文章的版式，后缀为.ars的文件是安装时使用的版式。

## ARI WIKI 中的COMPONENT

### 什么是COMPONENT？

COMPONENT是ARI WIKI中的一种组件，用于在页面上添加各种功能。例如，您可以添加一个图片、一个视频、一个表格等。

### 如何使用COMPONENT？

你只能在页面中用这个代码来使用COMPONENT：
```html
<import src="xxx"></import>
```
其中，xxx是COMPONENT的名称。

值得注意的是，不带后缀的xxx是引用时自带的页面内容，而带后缀的是永久的使用，比如：

```html
<import src="tool.jri"></import>
<tool></tool> <!-- 没安装时会被屏蔽 -->
```
### 制作COMPONENT

与版式不同，component只有ari的解析器。

你可以新建一个文章，输入内容，比如：
```html
<span>我的文本：${text}</span>
```
保存后，别人引用时就要加上：
```html
<import src="xxx" text="xxx"></import>
```
其中，xxx是文章的名称，text是传入的参数。
此时当没有text时会报错

为了避免报错，你可以在component中使用：
```html
<span>我的文本：${?text}</span>
```
这样，当没有text时，会显示“我的文本：”

----

然而，你还可以创建文件 xxx.jri。

在 xxx.jri 中，你可以使用以下代码：
```js
ariApp.add(你的组件名称,{
    version: 你需要的组件版本
})
ariApp.get(你的组件名称).then(function(你需要的组件名数组, 组件的元素){
    // 你的代码（以改变组件的元素为目的）
    return 组件的元素
})
```
此处会在教程详细教学。

----
建议将文章和jri一起放在页面里：
```html
<div visible type="jri">
    <div jridownload>xxx.jri</div>
</div>
```
其中xxx是组件名称。
这样会更方便。
----
# 网站使用链接

只有这个：[github版的网址](https://ari-backrooms.github.io/)

祝大家使用愉快!
