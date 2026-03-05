const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'images');
const images = ['marquee_pizza', 'marquee_burger', 'marquee_cuca'];

async function processImages() {
    try {
        for (const filename of images) {
            const filePath = path.join(imagesDir, `${filename}.png`);
            const newFilePath = path.join(imagesDir, `${filename}.webp`);

            const imgBuffer = await fs.promises.readFile(filePath);

            await sharp(imgBuffer)
                .resize({ width: 500, withoutEnlargement: true }) // Downsize slightly to fit the 350px display size efficiently
                .webp({ quality: 80 })
                .toFile(newFilePath);

            await fs.promises.unlink(filePath);
            console.log(`Converted and deleted: ${filename}.png`);
        }
        console.log('Marquee images optimized.');
    } catch (error) {
        console.error('Error processing images:', error);
    }
}

processImages();
