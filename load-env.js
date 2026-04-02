import fs from 'fs';
import path from 'path';

// Load .env.local
const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && \!key.startsWith('#')) {
      const value = rest.join('=').replace(/^["']|["']$/g, '');
      process.env[key.trim()] = value.trim();
    }
  });
}
