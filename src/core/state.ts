import * as fs from "node:fs";
import { getStatePath, ensureEnvSwitchDir } from "../utils/paths.js";

interface State {
  activeProfile: string | null;
}

function readState(root: string): State {
  const statePath = getStatePath(root);

  if (!fs.existsSync(statePath)) {
    return { activeProfile: null };
  }

  return JSON.parse(fs.readFileSync(statePath, "utf-8")) as State;
}

function writeState(root: string, state: State): void {
  ensureEnvSwitchDir(root);
  const statePath = getStatePath(root);
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2), {
    encoding: "utf-8",
    mode: 0o600,
  });
}

export function getActiveProfile(root: string): string | null {
  return readState(root).activeProfile;
}

export function setActiveProfile(root: string, name: string | null): void {
  writeState(root, { activeProfile: name });
}
