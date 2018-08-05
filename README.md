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
        dirs = [path.resolve(__dirname, 'node_modules')],
        filter = /\.json$/,
        dist = "dist/usingcomponents"
    }
};
```