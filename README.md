# Fluent UI System Icons

([中文](README.zh-cn.md)/**English**)

[Fluent UI System Icons](https://github.com/microsoft/fluentui-system-icons) are a collection of familiar, friendly and modern icons from Microsoft.

This repository contains icon files that are suitable for LCUI application usage. The only difference from the original version is the content of the CSS file. For specific generation rules, please refer to the file: [scripts/convert.js](scripts/convert.js).

![Fluent System Icons](art/readme-banner.png)

## Installation

Copy the files inside the dist directory to your application's working directory, and then load the css files:

```c
#include <LCUI.h>

...

ui_load_css_file("FluentSystemIcons-Regular.css");
ui_load_css_file("FluentSystemIcons-Filled.css");
ui_load_css_file("FluentSystemIcons-Resizable.css");
```

Usually, you only need to load `FluentSystemIcons-Regular.css` for most use cases.

## Update

Download the latest source code package of [fluentui-system-icons](https://github.com/microsoft/fluentui-system-icons), extract it, and then run:

```sh
node scripts/convert.js path/to/fluentui-system-icons-main/fonts
```
