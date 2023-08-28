# Fluent UI System Icons

(**中文**/[English](README.md))

[Fluent UI 系统图标](https://github.com/microsoft/fluentui-system-icons)是一组来自微软的熟悉、友好和现代的图标。

本代码库包含的图标文件是适合 LCUI 应用程序使用的版本，与原版的区别只是 css 文件内容，具体生成规则可查看文件：[scripts/convert.js](scripts/convert.js)

![Fluent System Icons](art/readme-banner.png)

## 安装

复制 dist 目录内的文件到你的应用程序工作目录内，然后加载 css 文件：

```c
#include <LCUI.h>

...

ui_load_css_file("FluentSystemIcons-Regular.css");
ui_load_css_file("FluentSystemIcons-Filled.css");
ui_load_css_file("FluentSystemIcons-Resizable.css");
```

通常你只需要加载 `FluentSystemIcons-Regular.css` 即可适用大部分使用场景。

## 更新

下载 [fluentui-system-icons](https://github.com/microsoft/fluentui-system-icons) 最新源码包，解压它，然后运行：

```sh
node scripts/convert.js path/to/fluentui-system-icons-main/fonts
```
