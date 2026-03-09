import * as fs from "node:fs";
import * as path from "node:path";
import { findProjectRoot, resolveAndValidatePath } from "../utils/paths.js";
import { loadProfile } from "../core/profile.js";
import { setActiveProfile } from "../core/state.js";

interface UseOptions {
  dryRun?: boolean;
  root?: string;
}

export function useCommand(name: string, options: UseOptions): void {
  try {
    const root = findProjectRoot(options.root);
    const profile = loadProfile(root, name);
    const filePaths = Object.keys(profile.files);

    if (options.dryRun) {
      console.log(`Dry run - would restore ${filePaths.length} file(s):`);
      for (const filePath of filePaths) {
        console.log(`  - ${filePath}`);
      }
      return;
    }

    for (const [relativePath, content] of Object.entries(profile.files)) {
      const absolutePath = resolveAndValidatePath(root, relativePath);
      fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
      fs.writeFileSync(absolutePath, content, { encoding: "utf-8", mode: 0o600 });
    }

    setActiveProfile(root, name);

    console.log(
      `Switched to "${name}" - restored ${filePaths.length} file(s):`
    );
    for (const filePath of filePaths) {
      console.log(`  - ${filePath}`);
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`);
    process.exit(1);
  }
}
