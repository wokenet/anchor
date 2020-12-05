const { execFile } = require('child_process')
const { promisify, callbackify } = require('util')
const gifsicle = require('gifsicle')
const loaderUtils = require('loader-utils')
const execFilePromise = promisify(execFile)

async function processImage(inputBuffer) {
  const options = loaderUtils.getOptions(this)
  const { size } = options

  const process = execFilePromise(gifsicle, ['--resize-height', size, '-'], {
    encoding: 'buffer',
  })
  process.child.stdin.write(inputBuffer)
  process.child.stdin.end()
  const { stdout } = await process

  return stdout
}

const processImageCb = callbackify(processImage)

module.exports = function resizeGif(inputBuffer) {
  this.cacheable()
  const cb = this.async()
  processImageCb.call(this, inputBuffer, cb)
}

module.exports.raw = true
