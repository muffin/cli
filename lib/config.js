import resolve from 'resolve'
import chalk from 'chalk'
import path from 'path'
import { log, isSite, exists } from '../lib/utils'

if (!isSite()) {
  log(chalk.red('No site in here! You need to be within a site\'s directory.'))
  process.exit(1)
}

let localModule = false

try {
  localModule = resolve.sync('muffin', {
    basedir: process.cwd()
  })
} catch (err) {
  log('The local instance of muffin couldn\'t be loaded')
  process.exit(1)
}

const Config = require(path.join(localModule, '../utils/config.js')),
      initializer = new Config

export default initializer
