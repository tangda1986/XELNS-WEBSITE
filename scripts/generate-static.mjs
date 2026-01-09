import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const OUTPUT_BASE = process.env.STATIC_OUTPUT_DIR || path.join(projectRoot, 'static-sites');
const DIST_DIR = process.env.STATIC_DIST_DIR || path.join(projectRoot, 'dist');
const SNAPSHOT_DIR = process.env.STATIC_SNAPSHOT_DIR || path.join(projectRoot, 'snapshots');
const SNAPSHOT_PATH_ARG = process.argv[2] || process.env.STATIC_SNAPSHOT_JSON || '';

const publishKeyMap = {
  products: 'xelns_ultra_products',
  productBanners: 'xelns_ultra_banners_product',
  solutionBanners: 'xelns_ultra_banners_solution',
  aboutBanners: 'xelns_ultra_banners_about',
  serviceBanners: 'xelns_ultra_banners_service',
  contactBanners: 'xelns_ultra_banners_contact',
  casesBanners: 'xelns_ultra_banners_cases',
  companyInfo: 'xelns_ultra_company_info',
  solutions: 'xelns_ultra_solutions',
  services: 'xelns_ultra_services',
  serviceDetails: 'xelns_ultra_service_details',
  homePageData: 'xelns_ultra_home_data',
  aboutData: 'xelns_ultra_about_data',
  servicePageData: 'xelns_ultra_service_page_data',
  customerCases: 'xelns_ultra_customer_cases'
};

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function findLatestSnapshot() {
  if (SNAPSHOT_PATH_ARG) {
    const abs = path.isAbsolute(SNAPSHOT_PATH_ARG) ? SNAPSHOT_PATH_ARG : path.join(projectRoot, SNAPSHOT_PATH_ARG);
    try {
      await fs.access(abs);
      return abs;
    } catch {
      return '';
    }
  }
  try {
    const files = await fs.readdir(SNAPSHOT_DIR);
    const jsons = files.filter(f => f.toLowerCase().endsWith('.json'));
    if (jsons.length === 0) return '';
    const stats = await Promise.all(jsons.map(async f => {
      const full = path.join(SNAPSHOT_DIR, f);
      const s = await fs.stat(full);
      return { full, mtime: s.mtimeMs };
    }));
    stats.sort((a, b) => b.mtime - a.mtime);
    return stats[0].full;
  } catch {
    return '';
  }
}

async function copyDistTo(outDir) {
  await fs.cp(DIST_DIR, outDir, { recursive: true });
}

function buildProject() {
  execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
}

async function readSnapshot(p) {
  try {
    const txt = await fs.readFile(p, 'utf-8');
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

function makeInjectionScript(snapshot) {
  const sText = JSON.stringify(snapshot);
  const mapText = JSON.stringify(publishKeyMap);
  return `(function(){try{var s=${sText};var m=${mapText};Object.keys(m).forEach(function(k){if(s&&typeof s[k]!=='undefined'){localStorage.setItem(m[k],JSON.stringify(s[k]));}});}catch(e){}})();`;
}

function sanitizeSnapshotForPublish(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return {};
  const allowedKeys = Object.keys(publishKeyMap);
  const out = {};
  for (const k of allowedKeys) {
    if (typeof snapshot[k] !== 'undefined') out[k] = snapshot[k];
  }
  return out;
}

async function injectIntoIndex(outDir, snapshot) {
  const indexPath = path.join(outDir, 'index.html');
  try {
    const html = await fs.readFile(indexPath, 'utf-8');
    const script = makeInjectionScript(snapshot);
    const modTag = html.match(/<script[^>]*type=["']module["'][^>]*>/i);
    let injected = '';
    if (modTag) {
      injected = html.replace(modTag[0], `<script>${script}</script>\n${modTag[0]}`);
    } else {
      injected = html.replace(/<\/head>/i, `<script>${script}</script>\n</head>`);
    }
    await fs.writeFile(indexPath, injected, 'utf-8');
  } catch {}
}

async function writeVercelConfig(outDir) {
  const vercelPath = path.join(outDir, 'vercel.json');
  const vercelConfig = {
    rewrites: [{ source: '/(.*)', destination: '/index.html' }]
  };
  await fs.writeFile(vercelPath, JSON.stringify(vercelConfig, null, 2), 'utf-8');
}

async function main() {
  await ensureDir(OUTPUT_BASE);
  buildProject();
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = path.join(OUTPUT_BASE, `site-${ts}`);
  await ensureDir(outDir);
  await copyDistTo(outDir);
  await writeVercelConfig(outDir);

  const snapPath = await findLatestSnapshot();
  if (snapPath) {
    const snap = await readSnapshot(snapPath);
    if (snap) {
      const publishSnap = sanitizeSnapshotForPublish(snap);
      await injectIntoIndex(outDir, publishSnap);
    }
  }

  console.log(outDir);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
