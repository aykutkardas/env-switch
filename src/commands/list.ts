import { findProjectRoot } from "../utils/paths.js";
import { listProfiles } from "../core/profile.js";
import { getActiveProfile } from "../core/state.js";

interface ListOptions {
  root?: string;
}

export function listCommand(options: ListOptions): void {
  try {
    const root = findProjectRoot(options.root);
    const profiles = listProfiles(root);
    const active = getActiveProfile(root);

    if (profiles.length === 0) {
      console.log("No saved profiles. Use `env-switch save <name>` to create one.");
      return;
    }

    console.log("Saved profiles:");
    for (const name of profiles) {
      const marker = name === active ? " (active)" : "";
      const prefix = name === active ? "* " : "  ";
      console.log(`${prefix}${name}${marker}`);
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`);
    process.exit(1);
  }
}
