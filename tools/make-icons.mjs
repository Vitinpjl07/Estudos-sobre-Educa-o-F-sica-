// Gera os ícones PNG do PWA sem dependências externas.
// Uso: node tools/make-icons.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "icons");
mkdirSync(outDir, { recursive: true });

const BLUE = [11, 79, 158];
const BLUE_DARK = [6, 45, 92];
const YELLOW = [255, 205, 0];
const WHITE = [255, 255, 255];

function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function png(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function draw(size) {
  const buf = Buffer.alloc(size * size * 4);
  const s = size / 512;
  const set = (x, y, color, alpha = 1) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    const a = alpha;
    buf[i] = Math.round(buf[i] * (1 - a) + color[0] * a);
    buf[i + 1] = Math.round(buf[i + 1] * (1 - a) + color[1] * a);
    buf[i + 2] = Math.round(buf[i + 2] * (1 - a) + color[2] * a);
    buf[i + 3] = Math.max(buf[i + 3], Math.round(255 * a));
  };
  const rect = (x0, y0, w, h, color, radius = 0) => {
    for (let y = Math.floor(y0); y < Math.ceil(y0 + h); y++)
      for (let x = Math.floor(x0); x < Math.ceil(x0 + w); x++) {
        if (radius > 0) {
          const cx = Math.min(Math.max(x, x0 + radius), x0 + w - radius);
          const cy = Math.min(Math.max(y, y0 + radius), y0 + h - radius);
          const d = Math.hypot(x - cx, y - cy);
          if (d > radius) continue;
        }
        set(x, y, color);
      }
  };
  const circle = (cx, cy, r, color) => {
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
      for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
        const d = Math.hypot(x - cx, y - cy);
        if (d <= r) set(x, y, color);
        else if (d <= r + 1) set(x, y, color, r + 1 - d);
      }
  };

  // Fundo arredondado azul
  rect(0, 0, size, size, BLUE_DARK, 96 * s);
  // Faixa diagonal amarela
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const v = (x + y) / size;
      if (v > 1.05 && v < 1.75) set(x, y, BLUE);
    }
  // Bola de vôlei estilizada (amarela)
  circle(256 * s, 210 * s, 92 * s, YELLOW);
  // Linhas da bola
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const dx = (x - 256 * s) / (92 * s);
      const dy = (y - 210 * s) / (92 * s);
      const d = Math.hypot(dx, dy);
      if (d <= 1 && (Math.abs(dx + dy * 0.7) < 0.12 || Math.abs(dx * 0.7 + dy) < 0.12)) set(x, y, BLUE_DARK);
    }
  // Faixa de gi (amarela) abaixo
  rect(88 * s, 336 * s, 336 * s, 26 * s, YELLOW, 13 * s);
  // Kimono estilizado (branco)
  rect(150 * s, 360 * s, 96 * s, 96 * s, WHITE, 12 * s);
  rect(246 * s, 360 * s, 116 * s, 96 * s, WHITE, 12 * s);
  return png(size, size, buf);
}

for (const size of [192, 512]) {
  writeFileSync(join(outDir, `icon-${size}.png`), draw(size));
  console.log(`icons/icon-${size}.png gerado`);
}
writeFileSync(join(root, "favicon.png"), draw(64));
console.log("favicon.png gerado");
