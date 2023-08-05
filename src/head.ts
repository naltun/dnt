import { bold } from 'https://deno.land/std@0.195.0/fmt/colors.ts'

const version = '0.1.2'

interface HeadOptions {
  host: string
}

function parseHeadOpt(userArgs): HeadOptions {
  if (userArgs.h || userArgs.help) {
    printUsageAndExit(0)
  } else if (userArgs.v || userArgs.version) {
    console.log(`dnt-head v${version}`)
    Deno.exit(0)
  } else if (userArgs._.length !== 2) {
    printUsageAndExit(1)
  }

  let host = userArgs._[1]
  if (!host.startsWith('https://')) {
    if (!host.startsWith('http://')) {
      host = `http://${host}` // Default to HTTP
    }
  }

  return {
    host: host,
  }
}

function printUsageAndExit(exitcode: number): void {
  console.log(`USAGE: dnt head [-hv] [http[s]://]<host>

DESCRIPTION
  dnt-head (v${version}) is an HTTP client for retrieving web server headers.

OPTIONS
  -h, --help          Print this help message
  -v, --version       Print dnt-head version`)
  Deno.exit(exitcode)
}

async function runHead(opt): Promise<void> {
  const initOpt = { method: 'HEAD', redirect: 'follow' }
  try {
    const resp = await fetch(opt.host, initOpt)
    console.log(`${opt.host.split('://')[0].toUpperCase()} ${resp.status} ${resp.statusText}`)
    resp.headers.forEach((val, header) => {
      console.log(`${bold(header)}: ${val}`)
    })
  } catch (err) {
    // Check for refused connection
    if (err.message.includes('Connection refused')) {
      console.log(`Failed to connect to ${opt.host}: Couldn't connect to server`)
    } else if (err.message.includes('dns error')) {
      console.log(`Name or service not known: ${opt.host}`)
      Deno.exit(1)
    } else {
      console.log(`error: ${err.message}`)
      Deno.exit(1)
    }
  }
}

export async function head(userArgs) {
  const opt = parseHeadOpt(userArgs)
  await runHead(opt)
}
