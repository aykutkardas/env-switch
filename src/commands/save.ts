import { findProjectRoot } from "../utils/paths.js";
import { scanEnvFiles } from "../core/scanner.js";
import { saveProfile } from "../core/profile.js";
import { setActiveProfile } from "../core/state.js";
import { ensureGitignore } from "../utils/gitignore.js";

interface SaveOptions {
  force?: boolean;
  root?: string;
}

export function saveCommand(name: string, options: SaveOptions): void {
  try {
    const root = findProjectRoot(options.root);
    const files = scanEnvFiles(root);

    if (files.size === 0) {
      console.log("No .env files found in the project.");
      return;
    }

    saveProfile(root, name, files, options.force ?? false);
    setActiveProfile(root, name);
    ensureGitignore(root);

    console.log(`Profile "${name}" saved with ${files.size} file(s):`);
    for (const filePath of files.keys()) {
      console.log(`  - ${filePath}`);
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`);
    process.exit(1);
  }
}
