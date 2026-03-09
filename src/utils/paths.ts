import * as path from "node:path";
import * as fs from "node:fs";

const ROOT_MARKERS = ["package.json", "turbo.json", ".git"];

export function findProjectRoot(startDir?: string): string {
  let dir = startDir || process.cwd();

  while (true) {
    for (const marker of ROOT_MARKERS) {
      const candidate = path.join(dir, marker);
      if (fs.existsSync(candidate)) {
        return dir;
      }
    }

    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error(
        "Could not find project root. Make sure you are inside a project with a package.json, turbo.json, or .git directory."
      );
    }
    dir = parent;
  }
}

export function getEnvSwitchDir(root: string): string {
  return path.join(root, ".env-switch");
}

export function getProfilesDir(root: string): string {
  return path.join(getEnvSwitchDir(root), "profiles");
}

export function getStatePath(root: string): string {
  return path.join(getEnvSwitchDir(root), "state.json");
}

export function ensureEnvSwitchDir(root: string): void {
  fs.mkdirSync(getProfilesDir(root), { recursive: true });
}

export function toRelative(root: string, absolute: string): string {
  return path.relative(root, absolute).split(path.sep).join("/");
}

export function resolveAndValidatePath(
  root: string,
  relativePath: string
): string {
  const resolved = path.resolve(root, relativePath);
  const normalizedRoot = path.resolve(root);

  if (!resolved.startsWith(normalizedRoot + path.sep) && resolved !== normalizedRoot) {
    throw new Error(
      `Path traversal detected: "${relativePath}" escapes the project root.`
    );
  }

  return resolved;
}
