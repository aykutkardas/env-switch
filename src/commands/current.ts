import { findProjectRoot } from "../utils/paths.js";
import { getActiveProfile } from "../core/state.js";

interface CurrentOptions {
  root?: string;
}

export function currentCommand(options: CurrentOptions): void {
  try {
    const root = findProjectRoot(options.root);
    const active = getActiveProfile(root);

    if (active) {
      console.log(`Current profile: ${active}`);
    } else {
      console.log("No active profile.");
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`);
    process.exit(1);
  }
}
