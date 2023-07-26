import { parse } from 'std/flags/mod.ts'
import { ping } from './ping.ts'

const version = '0.1.0'

function printUsageAndExit(exitcode: number) {
  console.log(`USAGE: dnt [ global options ] <command> [ options ] <host>

DESCRIPTION
  dnt is a collection of networking utilities for Deno. See COMMANDS for supported features.

GLOBAL OPTIONS
  -h, --help,         Print help
  -v, --version,      Print dnt version

COMMANDS:
  * ping

Tip: use -h with each command to learn more, e.g. \`dnt ping -h'`)
  Deno.exit(exitcode)
}

function main() {
  const args = parse(Deno.args)
  // Parse and validate user-supplied arguments and options.
  if (args._.length === 0) {
    if (args.h || args.help) {
      printUsageAndExit(0)
    } else if (args.v || args.version) {
      console.log(`dnt v${version}`)
      Deno.exit(0)
    } else {
      printUsageAndExit(1)
    }
  }

  switch (args._[0]) {
    case 'ping':
      ping(args)
      break
  }
}

main()
