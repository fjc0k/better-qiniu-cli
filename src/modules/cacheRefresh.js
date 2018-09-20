module.exports = async ({ qiniu, mac }, { files = null, dirs = null }) => {
  return new Promise((resolve, reject) => {
    const cdnManager = new qiniu.cdn.CdnManager(mac)
    cdnManager.refreshUrlsAndDirs(files, dirs, (err, resBody, resInfo) => {
      if (err) {
        reject(err)
      } else if (resInfo.statusCode === 200) {
        resolve(JSON.parse(resBody))
      } else {
        reject(resInfo)
      }
    })
  })
}
