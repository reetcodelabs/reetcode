import * as Fs from "https://deno.land/std@0.211.0/fs/mod.ts";
import * as Path from "https://deno.land/std@0.211.0/path/mod.ts";
import {
  error_log,
  warning_log,
} from "https://deno.land/x/denomander@0.9.3/mod.ts";
import Kia from "https://deno.land/x/kia@0.4.1/mod.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

import type { ProblemInterface } from "../types/problem.ts";
import { client, PRODUCTION_URL } from "../utils/api-client.ts";

export interface DownloadCommandArgs {
  problem: string;
  template: string;
  apiUrl?: string;
  overwrite?: boolean;
}

export const DownloadCommandArgsSchema = z.object({
  problem: z.string({ required_error: "The problem identifier is required." }),
  template: z.string({
    required_error: "The template identifier is required.",
  }),
  apiUrl: z.string().url().optional().default(PRODUCTION_URL),
});

export class DownloadCommand {
  static async run({
    problem: problemId,
    template: templateId,
    apiUrl,
    overwrite,
  }: DownloadCommandArgs) {
    const validation = await DownloadCommandArgsSchema.safeParseAsync({
      template: templateId,
      problem: problemId,
    });

    if (!validation.success) {
      error_log(`Invalid parameters passed.

${validation.error.errors.map((error) => error.message).join("\n")}
      `);

      return;
    }

    const apiClient = client(apiUrl);

    const spinner = new Kia("Fetching starter files...");

    spinner.start();

    const [problem, error] = await apiClient.request<ProblemInterface>(
      "GET",
      "/problems/download",
      { params: { problemId, templateId } },
    );

    if (error) {
      error_log(
        `Invalid problem ID or slug provided. Did you copy the command correctly?`,
      );

      return;
    }

    const template = problem.templates[0];

    if (!template) {
      error_log(
        `Invalid template provided. Did you copy the command correctly?`,
      );

      return;
    }

    spinner.succeed("Fetched template starter files.");

    // create project folder
    const projectFolderPath = Path.resolve(Deno.cwd(), problem.slug);
    const projectTemplatePath = Path.resolve(projectFolderPath, template.name);

    // check if template already exists.
    const templatePathExists = Fs.existsSync(projectTemplatePath);

    // if template dir exists and overwrite wasn't provided, log a warning.
    if (templatePathExists && !overwrite) {
      return warning_log(
        `The template folder already exists: ${problem.slug}/${template.name}. Please delete it or run this command with the --overwrite option.`,
      );
    }

    // if template exists and overwrite option was provided, delete it.
    if (templatePathExists && overwrite) {
      await Deno.remove(projectTemplatePath, { recursive: true });
    }

    spinner.start("Creating starter files...");

    // create project and template directories
    await Deno.mkdir(projectTemplatePath, { recursive: true });

    // for each starter file, create a file in the template folder.
    for (const file of template.starterFiles) {
      // define the file path.
      const filePath = Path.resolve(projectTemplatePath, file.path);

      await Fs.ensureDir(Path.dirname(filePath)); // make sure the directory exists.

      // create the file with its contents
      await Deno.writeTextFile(filePath, file.content, { create: true });
    }

    spinner.succeed("Created all starter files.");
  }
}
