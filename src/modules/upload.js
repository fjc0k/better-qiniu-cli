const globby = require('globby')
const path = require('path')
const _ = require('lodash')

module.exports = ({ qiniu, mac }, { from, to, prefix = '', cwd = process.cwd() }) => {
  return new Promise((resolve, reject) => {
    from = _.castArray(from)
    const files = globby.sync(from, { cwd, onlyFiles: true })
    Promise
      .all(files.map(file => {
        return new Promise((resolve, reject) => {
          const config = new qiniu.conf.Config()
          const formUploader = new qiniu.form_up.FormUploader(config)
          const putExtra = new qiniu.form_up.PutExtra()
          const putPolicy = new qiniu.rs.PutPolicy({
            scope: `${to}:${prefix}/${file}`.replace(/\/{2,}/g, '/').replace(/^\/+/, '') // 覆盖
          })
          const uploadToken = putPolicy.uploadToken(mac)
          formUploader.putFile(uploadToken, file, path.resolve(cwd, file), putExtra, (respErr, respBody, respInfo) => {
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
