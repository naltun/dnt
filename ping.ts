const version = '0.1.0'

interface PingOptions {
  count?: number
  host: string
  port?: number
}

function parsePingOptions(userArgs): PingOptions {
  if (userArgs.h || userArgs.help) {
    printUsageAndExit(0)
  } else if (userArgs.v || userArgs.version) {
    console.log(`dnt-ping v${version}`)
    Deno.exit(0)
  } else if (userArgs._.length !== 2) {
    printUsageAndExit(1)
  }

  return {
    count: userArgs.c || userArgs.count || Infinity,
    host: userArgs._[1],
    port: userArgs.p || userArgs.port || 80,
  }
}

function printUsageAndExit(exitcode: number) {
  console.log(`USAGE: dnt ping [-hv] [-c <num>] [-p <num>] <host>

DESCRIPTION
  dnt-ping (v${version}) is a TCP ping utility that verifies whether a host is reachable.

OPTIONS
  -c, --count <count> Send <count> pings and then stop
                        Default: infinity
  -h, --help          Print this help message
  -p, --port <port>   Specify the port to connect to
                        Default: 80
  -v, --version       Print dnt-ping version`)
  Deno.exit(exitcode)
}

async function runPing(opt: PingOptions): Promise<void> {
  let ctr = 0
  let conn
  let hostIP
  let pingstats = ''

  Deno.addSignalListener('SIGINT', () => {
    console.log(pingstats)
    Deno.exit(0)
  })

  switch (opt.host) {
    case '0.0.0.0':
      hostIP = '127.0.0.1'
      break
    case '127.0.0.1':
      hostIP = '127.0.0.1'
      break
    default:
      hostIP = await Deno.resolveDns(opt.host, 'A')
      break
  }

  const banner = `${opt.host} (${hostIP})`
  console.log(`Probing ${banner}...`)

  for (let i = 0; i < opt.count; i++) {
    let encoder = new TextEncoder()

    conn = await Deno.connect({
      hostname: opt.host,
      port: opt.port,
      transport: 'tcp',
    })
    conn.write(encoder.encode('GET /'))
    conn.close()

    ctr += 1
    console.log(`${banner}: tcp_seq=${ctr}`)

    // Wait 1 second before the next ping
    await new Promise((r) => setTimeout(r, 1000))
  }
}

export async function ping(userArgs) {
  const opt = parsePingOptions(userArgs)
  await runPing(opt)
}
