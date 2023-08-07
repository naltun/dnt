import { bold } from 'https://deno.land/std@0.195.0/fmt/colors.ts'

const version = '0.1.0'

interface ProxyOpt {
  port?: number
}

interface ProxyStats {
  contentLength: string
  contentType: string
  method: string
  status: string
  url: string
}

function displayStats(req: Request, res: Response): void {
  const stats: ProxyStats = {
    contentLength: res.headers.get('content-length'),
    contentType: res.headers.get('content-type'),
    method: req.method,
    status: res.status,
    url: req.url,
  }
  console.log(`${bold(stats.method)} ${stats.url}`)
  console.log(
    `${' '.repeat(stats.method.length)} ${bold('← ' + stats.status)} ${stats.contentType} ${
      stats.contentLength ? stats.contentLength + 'b' : '[no content]'
    }`,
  )
}

function parseProxyOpt(userArgs): ProxyOpt {
  if (userArgs.h || userArgs.help) {
    printUsageAndExit(0)
  } else if (userArgs.v || userArgs.version) {
    console.log(`dnt-proxy v${version}`)
    Deno.exit(0)
  } else if (userArgs._.length !== 1) {
    printUsageAndExit(1)
  }

  return {
    port: userArgs.p || userArgs.port || 8000,
  }
}

function printUsageAndExit(exitcode: number): void {
  console.log(`USAGE: dnt proxy [-hv]

DESCRIPTION
  dnt-proxy (v${version}) is a transparent proxy. It will investigate HTTP traffic
  without modifying requests.

OPTIONS
  -h, --help          Print this help message
  -p, --port <port>   Specify the port to proxy through
                        Default: 8000
  -v, --version       Print dnt-proxy version`)
  Deno.exit(exitcode)
}

async function proxyHandler(req: Request): Response {
  const reqOpt = { method: req.method, redirect: 'manual' }
  let res = await fetch(req.url, reqOpt)
  displayStats(req, res)

  while (res.status !== 200) {
    res = await fetch(res.headers.get('location', reqOpt))
    displayStats(req, res)
  }

  return res
}

async function runProxy(opt: ProxyOpt): Promise<void> {
  const servOpt = { hostname: '0.0.0.0', port: opt.port }
  Deno.serve(servOpt, proxyHandler)
}

export async function proxy(userArgs) {
  const opt = parseProxyOpt(userArgs)
  await runProxy(opt)
}
