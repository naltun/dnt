interface PingOptions {
  count?: number
  host: string
  port?: number
}

function parsePingOptions(userArgs): PingOptions {
  if (userArgs.h || userArgs.help) printUsageAndExit(0)
  if (userArgs._.length !== 2) printUsageAndExit(1)

  return {
    count: userArgs.c || userArgs.count || Infinity,
    host: userArgs._[1],
    port: userArgs.p || userArgs.port || 80,
  }
}

function printUsageAndExit(exitcode: number) {
  console.log(`USAGE: dnt ping [-c <num>] <host>

DESCRIPTION
  dnt-ping is a TCP ping utility that verifies whether a host is reachable.

OPTIONS
  -c, --count <count> Send <count> pings and then stop
                        Default: infinity
  -h, --help          Print this help message and exit
  -p, --port <port>   Specify the port to connect to
                        Default: 80`)
  Deno.exit(exitcode)
}

async function runPing(opt: PingOptions): Promise<void> {
  let ctr = 0
  let conn

  // Print banner
  const hostIP = await Deno.resolveDns(opt.host, 'A')
  console.log(`Probing ${opt.host} (${hostIP})...`)

  for (let i = 0; i < opt.count; i++) {
    conn = await Deno.connect({
      hostname: opt.host,
      port: opt.port,
      transport: 'tcp',
    })
    ctr += 1
    console.log(`${opt.host} (${hostIP}): tcp_seq=${ctr}`)

    // Wait 0.5 seconds before the next ping
    await new Promise(r => setTimeout(r, 500))
  }
}

export async function ping(userArgs) {
  const opt = parsePingOptions(userArgs)
  await runPing(opt)
}
