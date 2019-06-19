import { cdn } from 'qiniu'
import { ModuleFunction, QiniuHttpResponseInfo } from '../types'

export interface RefreshCdnCacheOptions {
  files?: string[],
  dirs?: string[],
}

export const refreshCdnCache: ModuleFunction<RefreshCdnCacheOptions> = async ({ mac, options }) => {
  return new Promise((resolve, reject) => {
    const { files = [], dirs = [] } = options

    const cdnManager = new cdn.CdnManager(mac)

    cdnManager.refreshUrlsAndDirs(
      files,
      dirs,
      (err, resBody, resInfo: QiniuHttpResponseInfo) => {
        if (err) {
          reject(err)
        } else if (resInfo.statusCode === 200) {
          resolve(JSON.parse(resBody))
        } else {
          reject(resInfo)
        }
      },
    )
  })
}
