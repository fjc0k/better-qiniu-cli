import * as modules from './modules'
import { auth } from 'qiniu'
import { Config } from './types'
import { isArray, isEmpty, sequential } from 'vtils'

export * from './types'
export * from './modules'

export async function qiniu(config: Config) {
  if (isEmpty(config.accessKey)) {
    throw new Error('accessKey 不能为空')
  }

  if (isEmpty(config.secretKey)) {
    throw new Error('secretKey 不能为空')
  }

  if (isArray(config.tasks)) {
    const mac = new auth.digest.Mac(config.accessKey, config.secretKey)
    try {
      return await sequential(
        config.tasks.map(({ type, options }) => async () => {
          await modules[type]({ mac, options } as any)
        }),
      )
    } catch (err) {
      throw err
    }
  }
}
