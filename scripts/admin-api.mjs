import http from 'http'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const snapshotsDir = path.join(projectRoot, 'snapshots')
const PORT = process.env.ADMIN_API_PORT ? Number(process.env.ADMIN_API_PORT) : 8787

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true })
}

async function writeSnapshot(obj) {
  await ensureDir(snapshotsDir)
  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  const p = path.join(snapshotsDir, `ui-${ts}.json`)
  await fs.writeFile(p, JSON.stringify(obj, null, 2), 'utf-8')
  return p
}

function runGenerate(snapPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['scripts/generate-static.mjs', snapPath], {
      cwd: projectRoot,
      stdio: ['ignore', 'pipe', 'pipe']
    })
    let lastLine = ''
    child.stdout.on('data', d => {
      const s = String(d)
      const lines = s.trim().split(/\r?\n/)
      lastLine = lines[lines.length - 1] || lastLine
    })
    let errBuf = ''
    child.stderr.on('data', d => {
      errBuf += String(d)
    })
    child.on('close', code => {
      if (code === 0) {
        resolve(lastLine)
      } else {
        reject(new Error(errBuf || 'generate failed'))
      }
    })
  })
}

function send(res, code, body, headers = {}) {
  const h = {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'POST,GET,OPTIONS',
    'access-control-allow-headers': 'content-type',
    ...headers
  }
  res.writeHead(code, h)
  res.end(JSON.stringify(body))
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    send(res, 200, { ok: true })
    return
  }
  if (req.method === 'GET' && req.url === '/health') {
    send(res, 200, { ok: true })
    return
  }
  if (req.method === 'POST' && req.url === '/generate-static') {
    try {
      let body = ''
      req.on('data', chunk => {
        body += chunk
      })
      req.on('end', async () => {
        try {
          const obj = JSON.parse(body || '{}')
          const p = await writeSnapshot(obj)
          const outDir = await runGenerate(p)
          send(res, 200, { ok: true, outDir })
        } catch (e) {
          send(res, 500, { ok: false, error: String(e && e.message || e) })
        }
      })
    } catch {
      send(res, 500, { ok: false })
    }
    return
  }
  send(res, 404, { ok: false, error: 'not_found' })
})

server.listen(PORT, () => {
  process.stdout.write(`admin api listening on http://localhost:${PORT}\n`)
})

