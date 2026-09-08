import { mkdir, access, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const generatedDirectory = path.resolve("generated");

function getFilename(name: string): string {
  return encodeURIComponent(name) + ".png";
}

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

export async function getSilhouette(name: string, imageUrl: string): Promise<Buffer> {
  await mkdir(generatedDirectory, { recursive: true });

  const outputPath = path.join(generatedDirectory, getFilename(name));

  // Return the cached version if we've already generated it.
  try {
    await access(outputPath);
    return await import("node:fs/promises").then(fs =>
      fs.readFile(outputPath)
    );
  } catch { }

  console.log(`Generating silhouette for ${name}`);

  const originalImage = await downloadImage(imageUrl);

  const { data, info } = await sharp(originalImage)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += info.channels) {
    data[i] = 0;     // Red
    data[i + 1] = 0; // Green
    data[i + 2] = 0; // Blue
  }

  const silhouette = await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels
    }
  }).png().toBuffer();

  await writeFile(outputPath, silhouette);

  return silhouette;
}