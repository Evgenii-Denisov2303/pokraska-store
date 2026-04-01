// Конвертация изображений в WebP для уменьшения размера
// Запуск: node scripts/convert-to-webp.js
// Требует: npm install  (нужна зависимость sharp из package.json)

let sharp;
try {
    sharp = require('sharp');
} catch {
    console.error('Ошибка: модуль sharp не найден.');
    console.error('Установите его командой:  npm install');
    process.exit(1);
}

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'assets', 'images');
const QUALITY = 82;

let converted = 0;
let skipped = 0;
let errors = 0;
let savedBytes = 0;

function getImageFiles(dir) {
    const result = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            result.push(...getImageFiles(fullPath));
        } else if (['.jpg', '.jpeg', '.png'].includes(path.extname(entry.name).toLowerCase())) {
            result.push(fullPath);
        }
    }
    return result;
}

async function convert(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const webpPath = filePath.slice(0, filePath.length - ext.length) + '.webp';

    if (fs.existsSync(webpPath)) {
        skipped++;
        return;
    }

    const originalSize = fs.statSync(filePath).size;

    try {
        await sharp(filePath).webp({ quality: QUALITY }).toFile(webpPath);

        const newSize = fs.statSync(webpPath).size;
        const saving = originalSize - newSize;
        savedBytes += saving;

        const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
        const pct = Math.round((saving / originalSize) * 100);
        console.log(`  ✓ ${rel}  ${Math.round(originalSize / 1024)}KB → ${Math.round(newSize / 1024)}KB  (-${pct}%)`);
        converted++;
    } catch (err) {
        console.error(`  ✗ ${path.relative(ROOT, filePath)}: ${err.message}`);
        errors++;
    }
}

async function main() {
    console.log('Конвертация изображений в WebP...\n');

    const files = getImageFiles(IMAGES_DIR);
    console.log(`Найдено файлов JPG/PNG: ${files.length}\n`);

    for (const file of files) {
        await convert(file);
    }

    console.log('\nГотово!');
    console.log(`  Конвертировано: ${converted}`);
    console.log(`  Пропущено (WebP уже есть): ${skipped}`);
    if (errors) console.log(`  Ошибок: ${errors}`);
    if (converted > 0) {
        console.log(`  Экономия: ~${Math.round(savedBytes / 1024 / 1024)} МБ`);
        console.log('\nWebP-файлы созданы рядом с оригиналами.');
        console.log('Сервер автоматически отдаёт .webp браузерам, которые его поддерживают.');
    }
}

main().catch(console.error);
