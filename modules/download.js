const fs = require('fs')
const https = require('https')

module.exports.download = body => {
  return new Promise((resolve, reject) => {

    const file = fs.createWriteStream(`data/${body.jobId}.zip`)

    const options = {
      hostname: 'recruit.zoho.com',
      path: `/recruit/bulk/v2/read/${body.jobId}/result`,
      method: 'GET',
      port : 443,
      headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${body.accessToken}`
      }
    }

    const req = https.request(options, res => {

      if (res.statusCode !== 200) {
        file.close()
        return reject({
          status: res.statusCode,
          message: `Authentication failed`
        })
      }

      const name = res.headers['content-disposition'].match(/"(.*)"/)[1]
      res.pipe(file)

    })

    req.on('error', e => reject(e.message))
    req.end()
    file.on('finish', () => resolve({message: 'Download successful'}))

  })
}
