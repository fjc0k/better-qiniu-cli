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

在项目根目录下新建 `qiniu.config.ts` 文件，写入配置：

```js
import { Config } from 'better-qiniu-cli'

export const config: Config = {
  accessKey: 'Access 密钥',
  secretKey: 'Secret 密钥',
  tasks: [
    {
      type: '任务类型',
      options: {
        // 任务选项
      }
    },
  ]
}
```

**注意：** `tasks` 中指定的任务将依次顺序执行。

### 使用

```bash
yarn qiniu
```

在 `package.json` 中你可以这么使用：

```json
{
  "scripts": {
    "deploy": "qiniu"
  }
}
```
