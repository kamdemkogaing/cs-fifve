import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import toIco from "to-ico";

const projectRoot = process.cwd();
const inputPath = path.join(projectRoot, "public", "images", "logo_fifve.jpeg");
const outputDir = path.join(projectRoot, "electron", "assets");
const outputPngPath = path.join(outputDir, "icon.png");
const outputIcoPath = path.join(outputDir, "icon.ico");

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const squarePngBuffer = await sharp(inputPath)
    .resize(1024, 1024, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toBuffer();

  await fs.writeFile(outputPngPath, squarePngBuffer);

  const icoBuffer = await toIco([
    await sharp(squarePngBuffer).resize(256, 256).png().toBuffer(),
    await sharp(squarePngBuffer).resize(128, 128).png().toBuffer(),
    await sharp(squarePngBuffer).resize(64, 64).png().toBuffer(),
    await sharp(squarePngBuffer).resize(48, 48).png().toBuffer(),
    await sharp(squarePngBuffer).resize(32, 32).png().toBuffer(),
    await sharp(squarePngBuffer).resize(16, 16).png().toBuffer(),
  ]);

  await fs.writeFile(outputIcoPath, icoBuffer);

  console.log(`Desktop icon generated: ${outputIcoPath}`);
}

main().catch((error) => {
  console.error("Unable to generate desktop icon:", error);
  process.exit(1);
});
