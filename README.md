# better-qiniu-cli

更好的 Node.js 七牛云命令行工具。

## 安装

```bash
yarn add better-qiniu-cli -D

# 或者

npm i better-qiniu-cli -D
```

## 用法

### 配置

在项目根目录下新建 `qiniu.config.js` 文件，写入配置：

```js
module.exports = {
  accessKey: 'Access 密钥',
  secretKey: 'Secret 密钥',
  tasks: [
    ['任务名1', {
      dir: '/'
    }],
    ['任务名2', {
      dir: '/'
    }]
  ]
}
```

### 使用

```bash
yarn qiniu

# 或者

npx qiniu
```

在 `package.json` 中你可以这么使用：

```json
{
  "scripts": {
    "deploy": "qiniu"
  }
}
```
