#!/usr/bin/env node

import bin from 'commander'
import chalk from 'chalk'
import { log, isSite, exists } from '../lib/utils'
import { exec, spawn } from 'child_process'
import config from '../lib/config'

bin
  .option('-w, --watch', 'Rebuild site if files change')
  .option('-p, --port <port>', 'The port on which your site will be available', parseInt)
  .parse(process.argv)

// Build before serving if "dist" directory doesn't exist
if (bin.watch || !exists(process.cwd() + '/dist')) {
  const builder = exec('muffin build -w')

  builder.stdout.on('data', data => process.stdout.write(chalk.green(data)))
  builder.stderr.on('data', data => console.error(data))

  builder.on('error', err => {
    throw err
  })
}

let server = spawn('node', ['index.js'], {
  stdio: 'inherit'
})

process.on('SIGINT', () => {
  server.kill('SIGINT')
  process.exit(0)
})

// Stop process when server script exists
server.on('exit', () => process.exit(0))

process.stdin.resume()
process.stdin.setEncoding('utf8')

process.stdin.on('data', data => {
  data = (data + '').trim().toLowerCase()

  if (data === 'rs') {
    server.kill('SIGINT')

    server = spawn('node', ['index.js'], {
      stdio: 'inherit'
    })

    console.log(chalk.green('Restarted!'))
  }
})
