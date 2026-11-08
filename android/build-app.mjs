// 把网页资产复制到 android/dist，保留模块版 app.js 及其依赖。
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(import.meta.dirname, 'dist');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

function copyTree(rel) {
  const src = path.join(root, rel);
  const dst = path.join(out, rel);
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const name of fs.readdirSync(src)) copyTree(path.posix.join(rel, name));
  } else {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  }
}

for (const rel of ['index.html', 'assets', 'vendor']) copyTree(rel);

const htmlPath = path.join(out, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8').replace(/\?v=[\w.-]+/g, '');
fs.writeFileSync(htmlPath, html);

console.log('android/dist 就绪（模块版，含进阶编辑器及签名依赖）');
