import globby from 'globby'
import path from 'path'
import { conf, form_up, rs } from 'qiniu'
import { ModuleFunction, QiniuHttpResponseInfo } from '../types'

export interface UploadOptions {
  from: string,
  to: string,
  cwd?: string,
  prefix?: string,
}

export const upload: ModuleFunction<UploadOptions> = async ({ mac, options }) => {
  return new Promise(async (resolve, reject) => {
    const files = await globby(
      options.from,
      {
        cwd: options.cwd || process.cwd(),
        onlyFiles: true,
      },
    )

    Promise
      .all(files.map(file => {
        return new Promise((resolve, reject) => {
          const config = new conf.Config()
          const formUploader = new form_up.FormUploader(config)
          const putExtra = new form_up.PutExtra()
          const key = `${options.prefix || ''}/${file}`.replace(/\/{2,}/g, '/').replace(/^\/+/, '')
          const putPolicy = new rs.PutPolicy({
            scope: `${options.to}:${key}`, // 覆盖
          })
          const uploadToken = putPolicy.uploadToken(mac)
          formUploader.putFile(uploadToken, key, path.resolve(options.cwd!, file), putExtra, (respErr, respBody, respInfo: QiniuHttpResponseInfo) => {
            if (respErr || respInfo.statusCode !== 200) {
              reject(respErr)
            } else {
              resolve(respBody)
            }
          })
        })
      }))
      .then(resolve)
      .catch(reject)
  })
}
