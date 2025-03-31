const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
}

// Copy necessary files
fs.copyFileSync(path.join(__dirname, 'index.js'), path.join(distPath, 'index.js'));
fs.copyFileSync(path.join(__dirname, '.env'), path.join(distPath, '.env'));

// Create icons directory in cryptolet/public if it doesn't exist
const iconsPath = path.join(__dirname, '..', 'cryptolet', 'public');
if (!fs.existsSync(iconsPath)) {
    fs.mkdirSync(iconsPath);
}

// Create a basic icon (you should replace this with your actual icon)
const createIcon = (size) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, 0, size, size);
    return canvas.toDataURL();
};

// Save icons
['16', '48', '128'].forEach(size => {
    const iconPath = path.join(iconsPath, `icon${size}.png`);
    if (!fs.existsSync(iconPath)) {
        // You should replace this with your actual icon files
        fs.writeFileSync(iconPath, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==', 'base64'));
    }
});