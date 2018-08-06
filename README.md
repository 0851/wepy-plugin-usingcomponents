# wepy-plugin-usingcomponents
wepy-plugin-usingcomponents auto require wx min app usingcomponents

自动装载usingcomponents

## 安装

```
npm install wepy-plugin-usingcomponents --save-dev
```

## 配置`wepy.config.js`

```js
const path = require("path");
module.exports.plugins = {
    'usingcomponents': {
        dirs = [path.resolve(__dirname, 'node_modules')], //查找的路径, 取第一个找到的目录
        filter = /\.json$/, //解析对应的json文件中的`usingComponents`
        dist = "dist/usingcomponents" //输出到指定目录 , 此目录必须在小程序根目录下
    }
};
```

```html
//page.wpy
<template lang="pug">
  view
    zan-tab(scroll="{{ true }}"
      list="{{ [{id:1,title:'name'}] }}"
      selected-id="{{ tags[0].id }}"
      height="{{ 30 }}")
</template>
<script>
    import wepy from 'wepy'
    export default class Index extends wepy.page {
        config = {
            usingComponents: {
                "zan-tab": "zanui-weapp/dist/tab"
            }
        }
    }
</script>
```

## 效果
![](./1.png)
![](./2.png)