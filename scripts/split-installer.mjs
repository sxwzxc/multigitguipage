/**
 * 将安装包按大小切分为多片，供 EdgeOne Pages 静态托管（单文件限制 25MiB）。
 *
 * 用法:
 *   node scripts/split-installer.mjs <源文件> [输出目录] [分片大小，默认 20MiB]
 *
 * 示例:
 *   node scripts/split-installer.mjs installer/MultiGitGui-Setup-1.1.5.exe public/downloads
 *
 * 输出: 源文件名同名的 <file>.part1..N 分片文件，并在 stdout 打印
 *       { file, size, parts, chunkSize, sha256 } 元数据（复制到 lib/installer.ts）。
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

function parseSize(input) {
  const match = /^(\d+(?:\.\d+)?)([KMG]?i?B)?$/i.exec(String(input).trim());
  if (!match) throw new Error(`无法解析分片大小: ${input}`);
  const value = parseFloat(match[1]);
  const unit = (match[2] || 'B').toLowerCase().replace('ib', 'b').replace('b', '');
  const mult = { '': 1, k: 1024, m: 1024 ** 2, g: 1024 ** 3 }[unit];
  if (mult === undefined) throw new Error(`不支持的单位: ${unit}`);
  return Math.floor(value * mult);
}

const [srcArg, outArg, sizeArg] = process.argv.slice(2);
if (!srcArg) {
  console.error('用法: node scripts/split-installer.mjs <源文件> [输出目录] [分片大小]');
  process.exit(1);
}

const src = path.resolve(srcArg);
const outDir = path.resolve(outArg ?? path.dirname(src));
const chunkSize = parseSize(sizeArg ?? '20MiB');

const name = path.basename(src);
const total = fs.statSync(src).size;
const parts = Math.ceil(total / chunkSize);

fs.mkdirSync(outDir, { recursive: true });
const fd = fs.openSync(src, 'r');

for (let i = 1; i <= parts; i++) {
  const offset = (i - 1) * chunkSize;
  const len = Math.min(chunkSize, total - offset);
  const buf = Buffer.alloc(len);
  fs.readSync(fd, buf, 0, len, offset);
  fs.writeFileSync(path.join(outDir, `${name}.part${i}`), buf);
}
fs.closeSync(fd);

// 清理残留的旧分片（数量超过本次 parts 的）
for (const entry of fs.readdirSync(outDir)) {
  const idx = entry.lastIndexOf('.part');
  if (idx === -1 || entry.slice(0, idx) !== name) continue;
  const n = Number(entry.slice(idx + '.part'.length));
  if (!Number.isInteger(n) || n < 1 || n > parts) {
    fs.unlinkSync(path.join(outDir, entry));
    console.warn(`已删除残留分片: ${entry}`);
  }
}

const sha256 = crypto
  .createHash('sha256')
  .update(fs.readFileSync(src))
  .digest('hex');

console.log(
  JSON.stringify(
    {
      file: name,
      size: total,
      parts,
      chunkSize,
      sha256,
    },
    null,
    2
  )
);
console.log(`分片输出目录: ${outDir}`);
