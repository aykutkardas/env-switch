# env-switch

Manage multiple `.env` configurations for monorepo projects. Save your current env files as named profiles and switch between them (e.g. `dev`, `staging`, `prod`) without editing files by hand.

## Requirements

- **Node.js** ≥ 18.17.0

## Install

```bash
npm install env-switch -g
```

Or run without installing (with [npx](https://docs.npmjs.com/cli/v8/commands/npx)):

```bash
npx env-switch <command> [options]
```

## Quick start

From your project root (or any subdirectory—env-switch finds the root via `package.json`, `turbo.json`, or `.git`):

```bash
# Save current .env files as a profile named "dev"
env-switch save dev

# Later: restore that profile
env-switch use dev

# List saved profiles
env-switch list

# Show which profile is active
env-switch current

# Remove a profile
env-switch delete dev
```

## Commands

| Command         | Description                                    |
| --------------- | ---------------------------------------------- |
| `save <name>`   | Save current `.env*` files as a named profile  |
| `use <name>`    | Switch to a profile (restore its `.env` files) |
| `list`          | List all saved profiles                        |
| `current`       | Show the currently active profile              |
| `delete <name>` | Delete a saved profile                         |

### Options

- **`--root <path>`** — Project root directory (default: auto-detected from cwd).
- **`save`**: **`-f, --force`** — Overwrite an existing profile.
- **`use`**: **`--dry-run`** — Show what would be restored without writing files.

## How it works

- **Project root** is found by walking up from the current directory until `package.json`, `turbo.json`, or `.git` is found.
- **Profiles** are stored under `.env-switch/profiles/` at the project root. Each profile is a JSON manifest listing relative paths and file contents.
- **Scanned files** are any file whose name starts with `.env` (e.g. `.env`, `.env.local`, `.env.development`). Paths matching `.gitignore` (and similar ignore rules) are skipped.
- **Active profile** is recorded in `.env-switch/state.json` when you run `use`.

### Example layout

```
my-monorepo/
├── .env-switch/
│   ├── state.json          # active profile name
│   └── profiles/
│       ├── dev.json
│       ├── staging.json
│       └── prod.json
├── apps/web/.env
├── packages/api/.env
└── package.json
```

## Profile names

Use only letters, numbers, hyphens, and underscores (e.g. `dev`, `staging`, `prod`, `my-profile_1`).

## License

MIT
