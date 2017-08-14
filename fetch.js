const getSubmoduleId = (author, repo, id, module) => {
  let url = `https://api.github.com/repos/${author}/${repo}/git/trees/${id}`
  return new Promise((resolve, reject) => {
    require('child_process').exec(`curl -L ${url}`, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr)
        return reject(error)
      }
      try {
        let tree = JSON.parse(stdout).tree
        let node = tree.filter(node => node.path === module)[0]
        if (!node) {
          return reject(new Error('CAN_NOT_FOUND_SUBMODULE'))
        }
        resolve(node.sha)
      } catch(error) {
        reject(error)
      }
    })
  })
}

const runShell = (file, env) => {
  return new Promise((resolve, reject) => {
    require('child_process').execFile(file, [], {
      env,
      encoding: 'utf8',
      timeout: 3 * 60 * 60 * 1000,
    })
  }, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr)
      return reject(error)
    }
    resolve(stdout)
  })
}

module.exports = (env, id, dist) => {
  const author = 'webxoss'
  return getSubmoduleId(author, 'webxoss-core', id, 'webxoss-client').then(clientId => {
    return getSubmoduleId(author, 'webxoss-client', clientId, 'background').then(assetsId => {
      return runShell('./fetch.sh', {
        DIST: dist,
        ENV: env,
        COMMIT_ID: id,
        CLIENT_ID: clientId,
        ASSETS_ID: assetsId,
      })
    })
  })
}
