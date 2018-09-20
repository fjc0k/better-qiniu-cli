module.exports = async ({ qiniu, mac }, { bucket, prefix = '' }) => {
  return new Promise((resolve, reject) => {
    const config = new qiniu.conf.Config()
    const bucketManager = new qiniu.rs.BucketManager(mac, config)
    bucketManager.listPrefix(bucket, { prefix }, (err, { items }, respInfo) => {
      if (err || respInfo.statusCode !== 200) {
        reject(err)
      } else {
        const deleteOperations = items.map(item => {
          return qiniu.rs.deleteOp(bucket, item.key)
        })
        bucketManager.batch(deleteOperations, (err, respBody) => {
          if (err) {
            reject(err)
          } else {
            resolve(respBody)
          }
        })
      }
    })
  })
}
