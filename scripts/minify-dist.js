#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const distDir = path.join(__dirname, '..', 'dist');

fs.readdirSync(distDir)
  .filter(f => f.endsWith('.js'))
  .forEach(file => {
    const filePath = path.join(distDir, file);
    const code = fs.readFileSync(filePath, 'utf8');
    minify(code).then(result => {
      fs.writeFileSync(filePath, result.code, 'utf8');
      console.log('Minified', file);
    }).catch(err => {
      console.error('Terser error in', file, err);
    });
  }); 