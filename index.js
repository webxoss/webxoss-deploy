'use strict'

const fetch = require('./fetch.js')

const params = require('minimist')(process.argv.slice(2))
const hook = require('githubhook')({
  secret: params.secret,
  trustProxy: false,
})

console.log(params)

hook.on('push:webxoss-core:refs/heads/test', data => {
  console.log(`test: ${data.after}`)
  fetch('test', data.after, params.dist, params.images)
    .then(() => console.log(`ok: test-${data.after}`))
    .catch(console.error)
})

hook.listen()
