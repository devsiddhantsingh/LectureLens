const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
const configPath = path.join(__dirname, '../public/js/config.js');

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log(`Debug: Read .env from ${envPath}, length: ${envContent.length}`);
    const lines = envContent.split(/\r?\n/);
    const config = {};

    lines.forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            console.log(`Debug: Matched line: ${line}`);
            const key = match[1].trim();
            // Remove surrounding quotes if present
            let value = match[2].trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            // Include VITE_ keys, GROQ_API_KEY, and ensure FIREBASE keys are captured even if they don't start with VITE_ (just in caseUser changed them)
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
