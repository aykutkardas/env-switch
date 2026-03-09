import * as fs from "node:fs";
import * as path from "node:path";
import ignore from "ignore";

const ALWAYS_IGNORE = [
  "node_modules",
  ".env-switch",
  ".git",
  "dist",
  "build",
  ".next",
  ".turbo",
  ".vercel",
  ".output",
];

export function createFilter(root: string): (relativePath: string) => boolean {
  const ig = ignore();

  ig.add(ALWAYS_IGNORE);

  const gitignorePath = path.join(root, ".gitignore");
  if (fs.existsSync(gitignorePath)) {
    const content = fs.readFileSync(gitignorePath, "utf-8");
    ig.add(content);
  }

  return (relativePath: string) => {
    // Never filter out .env files — they are the target of the scan
    const baseName = relativePath.split("/").pop() ?? "";
    if (baseName.startsWith(".env")) {
      return true;
    }
    return !ig.ignores(relativePath);
  };
}
