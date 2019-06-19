#!/usr/bin/env node
import * as TSNode from 'ts-node'
import fs from 'fs'
import ora from 'ora'
import path from 'path'
import { Config } from './types'
import { ii } from 'vtils'
import { qiniu } from '.'

TSNode.register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
  },
})

ii(async () => {
  const configFile = path.join(process.cwd(), 'qiniu.config.ts')
  if (fs.existsSync(configFile)) {
    const config: Config = require(configFile).config || require(configFile).default
    const spinner = ora(`${config.tasks.length} 条任务执行中...`).start()
    try {
      await qiniu(config)
      spinner.stopAndPersist({ text: `${config.tasks.length} 条任务执行完成.` })
    } catch (err) {
      spinner.stop()
      throw err
    }
  }
})
