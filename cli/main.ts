// commands
import { DownloadCommand } from "./commands/download.ts";
import { program } from "./program.ts";

program
  .command("download", "Download problem with template starter files.")
  .option("-p --problem", "The id or slug of the problem")
  .option("-t --template", "The id or slug of the template")
  .option("-u --apiUrl", "Base API URL to the reetcode.com API.")
  .option(
    "-f --overwrite",
    "Base API URL to the reetcode.com API.",
    (value: string) => !!value,
    false,
  )
  .action(DownloadCommand.run);

program.parse(Deno.args);
