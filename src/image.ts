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
    throw new Error(
      `Failed to download image: ${response.status} ${response.statusText}`
    );
  }

  return Buffer.from(await response.arrayBuffer());
}

export async function getSilhouette(
  name: string,
  imageUrl: string
): Promise<Buffer> {
  await mkdir(generatedDirectory, { recursive: true });

  const outputPath = path.join(
    generatedDirectory,
    getFilename(name)
  );

  // Return the cached version if we've already generated it.
  try {
    await access(outputPath);
    return await import("node:fs/promises").then(fs =>
      fs.readFile(outputPath)
    );
  } catch {
    // It doesn't exist yet. Generate it below.
  }

  console.log(`Generating silhouette for ${name}`);

  const originalImage = await downloadImage(imageUrl);

  const silhouette = await sharp(originalImage)
    .ensureAlpha()
    .tint("#000000")
    .png()
    .toBuffer();

  await writeFile(outputPath, silhouette);

  return silhouette;
}