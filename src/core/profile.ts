import * as fs from "node:fs";
import * as path from "node:path";
import {
  getProfilesDir,
  ensureEnvSwitchDir,
  resolveAndValidatePath,
} from "../utils/paths.js";

export interface ProfileManifest {
  name: string;
  createdAt: string;
  updatedAt: string;
  files: Record<string, string>;
}

function profilePath(root: string, name: string): string {
  return path.join(getProfilesDir(root), `${name}.json`);
}

function validateName(name: string): void {
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    throw new Error(
      `Invalid profile name "${name}". Use only letters, numbers, hyphens, and underscores.`
    );
  }
}

export function profileExists(root: string, name: string): boolean {
  return fs.existsSync(profilePath(root, name));
}

export function saveProfile(
  root: string,
  name: string,
  files: Map<string, string>,
  force: boolean
): void {
  validateName(name);
  ensureEnvSwitchDir(root);

  const filePath = profilePath(root, name);
  const now = new Date().toISOString();

  let manifest: ProfileManifest;

  if (fs.existsSync(filePath) && !force) {
    throw new Error(
      `Profile "${name}" already exists. Use --force to overwrite.`
    );
  }

  const existing = fs.existsSync(filePath)
    ? (JSON.parse(fs.readFileSync(filePath, "utf-8")) as ProfileManifest)
    : null;

  manifest = {
    name,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    files: Object.fromEntries(files),
  };

  fs.writeFileSync(filePath, JSON.stringify(manifest, null, 2), {
    encoding: "utf-8",
    mode: 0o600,
  });
}

export function loadProfile(root: string, name: string): ProfileManifest {
  validateName(name);
  const filePath = profilePath(root, name);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Profile "${name}" not found.`);
  }

  const manifest = JSON.parse(
    fs.readFileSync(filePath, "utf-8")
  ) as ProfileManifest;

  for (const relativePath of Object.keys(manifest.files)) {
    resolveAndValidatePath(root, relativePath);
  }

  return manifest;
}

export function deleteProfile(root: string, name: string): void {
  validateName(name);
  const filePath = profilePath(root, name);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Profile "${name}" not found.`);
  }

  fs.unlinkSync(filePath);
}

export function listProfiles(root: string): string[] {
  const dir = getProfilesDir(root);

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}
