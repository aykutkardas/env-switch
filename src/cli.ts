import { Command } from "commander";
import { saveCommand } from "./commands/save.js";
import { useCommand } from "./commands/use.js";
import { listCommand } from "./commands/list.js";
import { deleteCommand } from "./commands/delete.js";
import { currentCommand } from "./commands/current.js";

const program = new Command();

program
  .name("env-switch")
  .description("Manage multiple .env configurations for monorepo projects")
  .version("0.1.0");

program
  .command("save <name>")
  .description("Save current .env files as a named profile")
  .option("-f, --force", "Overwrite existing profile")
  .option("--root <path>", "Project root directory")
  .action(saveCommand);

program
  .command("use <name>")
  .description("Switch to a saved profile by restoring its .env files")
  .option("--dry-run", "Show what would be restored without writing files")
  .option("--root <path>", "Project root directory")
  .action(useCommand);

program
  .command("list")
  .description("List all saved profiles")
  .option("--root <path>", "Project root directory")
  .action(listCommand);

program
  .command("delete <name>")
  .description("Delete a saved profile")
  .option("--root <path>", "Project root directory")
  .action(deleteCommand);

program
  .command("current")
  .description("Show the currently active profile")
  .option("--root <path>", "Project root directory")
  .action(currentCommand);

program.parse();
