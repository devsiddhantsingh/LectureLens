const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
const configPath = path.join(__dirname, '../js/config.js');

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    const config = {};

    lines.forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            // Include VITE_ keys and any other relevant ones
            if (key.startsWith('VITE_') || key === 'GROQ_API_KEY') {
                config[key] = value;
            }
        }
    });

    const fileContent = `// Auto-generated config from .env
export const CONFIG = ${JSON.stringify(config, null, 4)};
`;

    fs.writeFileSync(configPath, fileContent);
    console.log('✅ Config generated at js/config.js');

} catch (err) {
    if (err.code === 'ENOENT') {
        console.warn('⚠️ .env file not found. Skipping config generation.');
        // Create an empty config to prevent runtime errors
        fs.writeFileSync(configPath, 'export const CONFIG = {};');
    } else {
        console.error('❌ Error generating config:', err);
    }
}
