import fs from 'fs-extra';
import path from 'path';

export const packageInfo = {
  version: '1.0.0',
  name: 'pern-fortress-cli',
};

// Hole Package Info falls package.json existiert
try {
  const packagePath = path.join(__dirname, '../../package.json');
  if (fs.existsSync(packagePath)) {
    const packageData = fs.readJsonSync(packagePath);
    packageInfo.version = packageData.version || '1.0.0';
    packageInfo.name = packageData.name || 'pern-fortress-cli';
  }
} catch (error) {
  // Fallback zu Standard-Werten
}
