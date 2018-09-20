#!/usr/bin/env node
const path = require('path')
const proc = require('process')
const chalk = require('chalk')
const _ = require('lodash')
const qiniu = require('qiniu')
const modules = require('./modules')

const cwd = proc.cwd()
const configFile = path.join(cwd, 'qiniu.config.js')

let config
try {
  config = require(configFile)
} catch (error) {
  throw new Error(chalk.red(`找不到配置文件 --> ${configFile}`))
}

if (!_.isPlainObject(config)) {
  throw new Error(chalk.red(`配置应为对象 --> ${configFile}`))
}

if (!config.accessKey || !config.secretKey) {
  throw new Error(chalk.red(`accessKey 或 secretKey 不能为空 --> ${configFile}`))
}

if (_.isArray(config.tasks)) {
  const mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey)
  ;(async () => {
    for (let i = 0, len = config.tasks.length; i < len; i++) {
      const [taskName, options] = config.tasks[i]
      try {
        await modules[taskName]({ qiniu, mac }, options || {})
      } catch (err) {
        throw new Error(err)
      }
    }
    console.log(chalk.green('任务执行完成！'))
  })()
}
