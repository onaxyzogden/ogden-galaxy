const { execSync } = require('child_process');
execSync('npx vite dev --host', { stdio: 'inherit', cwd: __dirname });
