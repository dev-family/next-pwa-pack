#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const files = [
  'PWAProvider.js',
  'RegisterSW.js',
  'CacheCurrentPage.js',
  'DevPWAStatus.js',
  'SWRevalidateListener.js',
];

const distDir = path.join(__dirname, '..', 'dist');

for (const file of files) {
  const filePath = path.join(distDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.startsWith('"use client";')) {
      content = '"use client";\n' + content;
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Added "use client" to', file);
    }
  }
} 