const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'images');

async function processImages() {
    try {
        const files = await fs.promises.readdir(imagesDir);

        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                const filePath = path.join(imagesDir, file);
                const filename = path.parse(file).name;
                const newFilePath = path.join(imagesDir, `${filename}.webp`);

                let width;
                if (file === 'logo.png' || file === 'logo.webp') {
                    width = 300;
                } else if (file.startsWith('slide')) {
                    width = 1920;
                } else {
                    width = 1000;
                }

                // Check size of original file
                const statsBefore = await fs.promises.stat(filePath);

                // Read original file into buffer to avoid keeping it locked if replacing
                const imgBuffer = await fs.promises.readFile(filePath);

                await sharp(imgBuffer)
                    .resize({ width: width, withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toFile(newFilePath);

                const statsAfter = await fs.promises.stat(newFilePath);

                console.log(`Processed: ${file} -> ${filename}.webp | Size change: ${(statsBefore.size / 1024).toFixed(2)} KB -> ${(statsAfter.size / 1024).toFixed(2)} KB (-${((1 - statsAfter.size / statsBefore.size) * 100).toFixed(2)}%)`);

                // If original wasn't webp or we are overwriting we don't need to delete, unless the extension changed
                if (ext !== '.webp') {
                    await fs.promises.unlink(filePath);
                    console.log(`Deleted original: ${file}`);
                }
            }
        }
        console.log('All images processed successfully.');
    } catch (error) {
        console.error('Error processing images:', error);
    }
}

processImages();
