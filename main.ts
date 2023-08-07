import { head } from './src/head.ts'
import { host } from './src/host.ts'
import { parse } from 'https://deno.land/std@0.195.0/flags/mod.ts'
import { ping } from './src/ping.ts'
import { proxy } from './src/proxy.ts'

const version = '0.4.0'

function handleGlobalOpt(args) {
  if (args.h || args.help) {
    printUsageAndExit(0)
  } else if (args.v || args.version) {
    console.log(`dnt v${version}`)
    Deno.exit(0)
  } else {
    printUsageAndExit(1)
  }
}

function printUsageAndExit(exitcode: number) {
  console.log(`USAGE: dnt [ global options ] <command> [ options ] <host>

DESCRIPTION
  dnt (v${version}) is a collection of lightweight networking utilities.
  See COMMANDS for supported features.

COMMANDS:
  * head
  * host
  * ping
  * proxy

GLOBAL OPTIONS
  -h, --help          Print this help message
  -v, --version       Print dnt version

Tip: use -h with each command to learn more, e.g. \`dnt ping -h'`)
  Deno.exit(exitcode)
}

// Enter main loop
if (import.meta.main) {
  const userArgs = parse(Deno.args)
  // Parse and validate user-supplied arguments and options.
  if (userArgs._.length === 0) handleGlobalOpt(userArgs)

  switch (userArgs._[0]) {
    case 'head':
      head(userArgs)
      break
    case 'host':
      host(userArgs)
      break
    case 'ping':
      ping(userArgs)
      break
    case 'proxy':
      proxy(userArgs)
      break
    default:
      printUsageAndExit(1)
  }
}
