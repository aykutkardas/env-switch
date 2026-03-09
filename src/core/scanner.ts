import * as fs from "node:fs";
import * as path from "node:path";
import { toRelative } from "../utils/paths.js";
import { createFilter } from "../utils/ignore.js";

export function scanEnvFiles(root: string): Map<string, string> {
  const filter = createFilter(root);
  const result = new Map<string, string>();

  function walk(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = toRelative(root, fullPath);

      if (entry.isDirectory()) {
        if (filter(relativePath + "/")) {
          walk(fullPath);
        }
        continue;
      }

      if (entry.isFile() && entry.name.startsWith(".env")) {
        if (filter(relativePath)) {
          const content = fs.readFileSync(fullPath, "utf-8");
          result.set(relativePath, content);
        }
      }
    }
  }

  walk(root);
  return result;
}
