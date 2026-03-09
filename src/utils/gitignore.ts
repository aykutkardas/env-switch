import * as fs from "node:fs";
import * as path from "node:path";

export function ensureGitignore(root: string): void {
  const gitignorePath = path.join(root, ".gitignore");

  if (!fs.existsSync(gitignorePath)) {
    return;
  }

  const content = fs.readFileSync(gitignorePath, "utf-8");

  if (content.includes(".env-switch")) {
    return;
  }

  const newline = content.endsWith("\n") ? "" : "\n";
  fs.appendFileSync(
    gitignorePath,
    `${newline}\n# env-switch profiles\n.env-switch/\n`,
    "utf-8"
  );

  console.log("Added .env-switch/ to .gitignore");
}
