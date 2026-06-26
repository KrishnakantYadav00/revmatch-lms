const fs = require('fs');
const path = require('path');

function getTruePath(filePath) {
  const parts = filePath.split(path.sep);
  let current = parts[0] + path.sep;
  
  for (let i = 1; i < parts.length; i++) {
    if (!parts[i]) continue;
    if (!fs.existsSync(current)) return null;
    const dir = fs.readdirSync(current);
    const match = dir.find(d => d.toLowerCase() === parts[i].toLowerCase());
    if (!match) return null; // File doesn't exist even case-insensitively
    if (match !== parts[i]) return { expected: match, actual: parts[i], path: current };
    current = path.join(current, match);
  }
  return true;
}

function scanDir(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory() && dirent.name !== 'node_modules' && dirent.name !== 'dist') {
      scanDir(fullPath);
    } else if (dirent.isFile() && /\.(js|jsx)$/.test(dirent.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        let importPath = match[1];
        if (importPath.startsWith('.')) {
          let resolved = path.resolve(dir, importPath);
          // Try with .js, .jsx, etc if no extension
          let exts = ['', '.js', '.jsx', '/index.js', '/index.jsx'];
          let found = false;
          let finalPath = '';
          for (let ext of exts) {
            if (fs.existsSync(resolved + ext)) {
              finalPath = resolved + ext;
              found = true;
              break;
            }
          }
          if (found) {
            const check = getTruePath(finalPath);
            if (check !== true) {
               console.log('File:', fullPath);
               console.log('Import:', importPath);
               console.log('Case mismatch:', check);
            }
          }
        }
      }
    }
  });
}
scanDir(path.resolve('src'));
