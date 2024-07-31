// Enable ESM (ES Modules) support by adding "type": "module" in package.json

import fs from 'fs';
import path from 'path';

// Function to parse .env file
function parseEnvFile(filePath) {
    const envContent = fs.readFileSync(filePath, 'utf8');
    const lines = envContent.split('\n');

    lines.forEach(line => {
        // Remove comments and empty lines
        if (line.trim() && !line.startsWith('#')) {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        }
    });
}

// Load the .env file
const envPath = path.resolve(process.cwd(), '.env'); // Use process.cwd() for the current working directory
parseEnvFile(envPath);
