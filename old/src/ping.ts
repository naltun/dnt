const version = '0.1.1'

// Global variables
let conn
let connected = false
let ctr = 1
let failed = 0
let hostIP
let opt
let passed = 0

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

function printStats() {
  const total = passed + failed
  const loss = (failed / total * 100).toFixed(2) // Round 2 decimal places
  console.log(`\n--- ${opt.host} port:${opt.port} TCP ping statistics ---`)
  console.log(`${total} probes transmitted, ${passed} received, ${loss}% probe loss`)
}

function printUsageAndExit(exitcode: number) {
  console.log(`USAGE: dnt ping [-hv] [-c <num>] [-p <num>] <host>

DESCRIPTION
  dnt-ping (v${version}) is a TCP "ping" client that verifies whether a host is reachable or not.

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
  Deno.addSignalListener('SIGINT', () => {
    printStats()
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
      // resolveDns() returns Promise<string[]>, so let's use the A record at index 0.
      hostIP = (await Deno.resolveDns(opt.host, 'A'))[0]
      break
  }

  const banner = `${opt.host} (${hostIP})`
  console.log(`Probing ${banner} port:${opt.port}...`)

  for (let i = 0; i < opt.count; i++) {
    const encoder = new TextEncoder()

    try {
      conn = await Deno.connect({
        hostname: opt.host,
        port: opt.port,
        transport: 'tcp',
      })
      await conn.write(encoder.encode('GET /'))
      conn.close()

      connected = true
      passed += 1
    } catch (err) {
      if (err.message.includes('Connection refused')) {
        connected = false
        failed += 1
      } else {
        console.log(`error: ${err.message}`)
        Deno.exit(1)
      }
    } finally {
      console.log(`${banner}: tcp_seq=${ctr} connected=${connected}`)
      ctr += 1
    }

    // Wait 1 second before the next ping
    await new Promise((r) => setTimeout(r, 1000))
  }
}

export async function ping(userArgs) {
  opt = parsePingOptions(userArgs)
  await runPing(opt)
  printStats()
}
