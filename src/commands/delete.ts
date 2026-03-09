import { findProjectRoot } from "../utils/paths.js";
import { deleteProfile } from "../core/profile.js";
import { getActiveProfile, setActiveProfile } from "../core/state.js";

interface DeleteOptions {
  root?: string;
}

export function deleteCommand(name: string, options: DeleteOptions): void {
  try {
    const root = findProjectRoot(options.root);
    const active = getActiveProfile(root);

    deleteProfile(root, name);

    if (active === name) {
      setActiveProfile(root, null);
    }

    console.log(`Profile "${name}" deleted.`);
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`);
    process.exit(1);
  }
}
