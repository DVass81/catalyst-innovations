import fs from "node:fs";
import path from "node:path";

/** Drop images into /public/founders/<name>.jpg (or .jpeg/.png/.webp) — picked up automatically. */
export function founderPhoto(name: string): string | null {
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    if (fs.existsSync(path.join(process.cwd(), "public", "founders", `${name}.${ext}`))) {
      return `/founders/${name}.${ext}`;
    }
  }
  return null;
}
