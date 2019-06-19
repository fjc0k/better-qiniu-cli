import globby from 'globby'
import path from 'path'
import { castArray, OneOrMore } from 'vtils'
import { conf, form_up, rs } from 'qiniu'
import { ModuleFunction, QiniuHttpResponseInfo } from '../types'

export interface UploadOptions {
  bucket: string,
  from: OneOrMore<string>,
  to?: string,
  cwd?: string,
}

export const upload: ModuleFunction<UploadOptions> = async ({ mac, options }) => {
  return new Promise(async (resolve, reject) => {
    const { bucket, from, to = '', cwd = process.cwd() } = options

    const files = await globby(
      castArray(from),
      {
        cwd: cwd,
        onlyFiles: true,
      },
    )

    Promise
      .all(files.map(file => {
        return new Promise((resolve, reject) => {
          const config = new conf.Config()
          const formUploader = new form_up.FormUploader(config)
          const putExtra = new form_up.PutExtra()
          const key = `${to}/${file}`.replace(/\/{2,}/g, '/').replace(/^\/+/, '')
          const putPolicy = new rs.PutPolicy({
            scope: `${bucket}:${key}`, // 覆盖
          })
          const uploadToken = putPolicy.uploadToken(mac)
          formUploader.putFile(uploadToken, key, path.resolve(cwd, file), putExtra, (respErr, respBody, respInfo: QiniuHttpResponseInfo) => {
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
