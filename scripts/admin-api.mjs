import http from 'http'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { spawn } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const snapshotsDir = path.join(projectRoot, 'snapshots')
const PORT = process.env.ADMIN_API_PORT ? Number(process.env.ADMIN_API_PORT) : 8787

// Load .env manually
async function loadEnv() {
  const envPath = path.join(projectRoot, '.env')
  try {
    const envContent = await fs.readFile(envPath, 'utf-8')
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w]+)\s*=\s*(.*)?\s*$/)
      if (match) {
        const key = match[1]
        let value = match[2] || ''
        // Remove quotes if present
        if (value.length >= 2 && ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))) {
          value = value.slice(1, -1)
        }
        process.env[key] = process.env[key] || value
      }
    })
    console.log('Loaded .env configuration')
  } catch (e) {
    console.log('No .env file found or failed to load')
  }
}

await loadEnv()

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

async function invokeHandler(relPath, req, res) {
  try {
    // Dynamic import the handler
    // Use pathToFileURL for Windows compatibility
    const mod = await import(pathToFileURL(path.join(projectRoot, relPath)).href)
    const handler = mod.default
    
    // Mock Vercel/Express response methods
    res.status = (code) => {
      res.statusCode = code
      return res
    }
    res.json = (data) => {
      send(res, res.statusCode || 200, data)
      return res
    }
    
    await handler(req, res)
  } catch (e) {
    console.error(`Error invoking ${relPath}:`, e)
    send(res, 500, { error: e.message })
  }
}

const server = http.createServer(async (req, res) => {
  // CORS
  if (req.method === 'OPTIONS') {
    send(res, 200, { ok: true })
    return
  }

  // Parse Body for all requests
  let bodyStr = ''
  req.on('data', chunk => { bodyStr += chunk })
  req.on('end', async () => {
    try {
      if (bodyStr) {
        req.body = JSON.parse(bodyStr)
      } else {
        req.body = {}
      }
    } catch {
      req.body = {}
    }

    console.log(`${req.method} ${req.url}`)

    if (req.method === 'GET' && req.url === '/health') {
      send(res, 200, { ok: true })
      return
    }

    if (req.method === 'POST' && req.url === '/generate-static') {
      try {
        const obj = req.body
        const p = await writeSnapshot(obj)
        const outDir = await runGenerate(p)
        send(res, 200, { ok: true, outDir })
      } catch (e) {
        send(res, 500, { ok: false, error: String(e && e.message || e) })
      }
      return
    }

    // Proxy API requests
    if (req.url.startsWith('/api/store')) {
      await invokeHandler('api/store.js', req, res)
      return
    }

    if (req.url.startsWith('/api/init-db')) {
      await invokeHandler('api/init-db.js', req, res)
      return
    }

    send(res, 404, { ok: false, error: 'not_found' })
  })
})

server.listen(PORT, () => {
  process.stdout.write(`admin api listening on http://localhost:${PORT}\n`)
})
