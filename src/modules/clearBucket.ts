import { conf, rs } from 'qiniu'
import { ModuleFunction, QiniuHttpResponseInfo } from '../types'

export interface ClearBucketOptions {
  bucket: string,
  prefix?: string,
}

export const clearBucket: ModuleFunction<ClearBucketOptions> = async ({ mac, options }) => {
  return new Promise((resolve, reject) => {
    const { bucket, prefix = '' } = options

    const config = new conf.Config()
    const bucketManager = new rs.BucketManager(mac, config)

    bucketManager.listPrefix(
      bucket,
      { prefix },
      (err, { items }: { items: Array<{ key: string }> } = {} as any, respInfo: QiniuHttpResponseInfo) => {
        if (err || respInfo.statusCode !== 200) {
          reject(err)
        } else if (items && items.length) {
          const deleteOperations = items.map(item => {
            return rs.deleteOp(bucket, item.key)
          })
          bucketManager.batch(deleteOperations, (err, respBody) => {
            if (err) {
              reject(err)
            } else {
              resolve(respBody)
            }
          })
        } else {
          resolve()
        }
      },
    )
  })
}
