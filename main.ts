import { parse } from 'std/flags/mod.ts'
import { ping } from './ping.ts'

const version = '0.1.1'

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
  * ping

GLOBAL OPTIONS
  -h, --help          Print this help message
  -v, --version       Print dnt version

Tip: use -h with each command to learn more, e.g. \`dnt ping -h'`)
  Deno.exit(exitcode)
}

function main() {
  const userArgs = parse(Deno.args)
  // Parse and validate user-supplied arguments and options.
  if (userArgs._.length === 0) handleGlobalOpt(userArgs)

  switch (userArgs._[0]) {
    case 'ping':
      ping(userArgs)
      break
    default:
      printUsageAndExit(1)
  }
}

main()
