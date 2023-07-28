// TODO:
// - add dynamic name server option, e.g. `--nameserver-ip 1.1.1.1'

const version = '0.1.0'

interface HostOptions {
  host: string
}

function parseHostOpt(userArgs): HostOptions {
  if (userArgs.h || userArgs.help) {
    printUsageAndExit(0)
  } else if (userArgs.v || userArgs.version) {
    console.log(`dnt-host v${version}`)
    Deno.exit(0)
  } else if (userArgs._.length !== 2) {
    printUsageAndExit(1)
  }

  return { host: userArgs._[1] }
}

function printUsageAndExit(exitcode: number): void {
  console.log(`USAGE: dnt host [-hv] <host>

DESCRIPTION
  dnt-host (v${version}) is a DNS records lookup utility

OPTIONS
  -h, --help          Print this help message
  -v, --version       Print dnt-host version`)
  Deno.exit(exitcode)
}

async function runHost(opt: HostOptions): Promise<void> {
  const a = await Deno.resolveDns(opt.host, 'A')
  const aaaa = await Deno.resolveDns(opt.host, 'AAAA')
  const mx = (await Deno.resolveDns(opt.host, 'MX'))[0]

  if (a) console.log(`${opt.host} has address ${a}`)
  if (aaaa) console.log(`${opt.host} has IPv6 address ${aaaa}`)
  if (mx) console.log(`${opt.host} mail is handled by ${mx.preference} ${mx.exchange}`)
}

export async function host(userArgs) {
  const opt = parseHostOpt(userArgs)
  await runHost(opt)
}
