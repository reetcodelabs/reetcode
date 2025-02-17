import {
  type CareerPath,
  type Difficulty,
  PrismaClient,
  type ProblemSet,
  type TechStack,
} from "@prisma/client";
import Consola from "consola";
import Fs from "fs";
import Path from "path";
import Showdown from "showdown";
import { fileURLToPath } from "url";

import careerPathsData from "../src/seed/career-paths.json";
import problemSetsData from "../src/seed/problem-sets.json";
import problemsData from "../src/seed/problems.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

// fetch all the problem sets
const prisma = new PrismaClient();
// write all of them to DB

// fetch all the problems

// write all of them to DB

async function seedCareerPaths() {
  const paths = [];

  for (const careerPath of careerPathsData) {
    Consola.start(`Upserting career path: ${careerPath.slug}...`);

    const insertedCareerPath = await prisma.careerPath.upsert({
      where: {
        slug: careerPath.slug,
      },
      create: {
        name: careerPath.name,
        slug: careerPath.slug,
      },
      update: {
        name: careerPath.name,
      },
    });

    Consola.success(`Upserted career path: ${careerPath.slug}\n`);

    paths.push(insertedCareerPath);
  }

  return paths;
}

async function seedProblemSets() {
  const problemSets = [];

  for (const problemSet of problemSetsData) {
    Consola.start(`Upserting problem set: ${problemSet.slug}...`);

    const payload = {
      name: problemSet.name,
      icon: problemSet.icon,
      shortDescription: problemSet.shortDescription,
      longDescription: problemSet.longDescription,
    };
    const insertedProblemSet = await prisma.problemSet.upsert({
      where: {
        slug: problemSet.slug,
      },
      create: {
        ...payload,
        slug: problemSet.slug,
      },
      update: { ...payload },
    });

    Consola.success(`Upserted problem set: ${problemSet.slug}. \n`);

    problemSets.push(insertedProblemSet);
  }

  return problemSets;
}

async function seedProblems(
  careerPaths: CareerPath[],
  problemSets: ProblemSet[],
) {
  // fetch all problems from the json

  // fetch all templates for the problem

  for (const problem of problemsData) {
    Consola.start(`Upserting problem: ${problem.slug}...`);
    const getTemplatesWithFiles = (rootFolder: string) =>
      problem.templates.map((template) => {
        const folderLocation = Path.resolve(
          __dirname,
          "..",
          "src",
          "seed",
          rootFolder,
          problem.slug,
          template.folder,
        );

        const allTemplateFiles = Fs.readdirSync(folderLocation, {
          recursive: true,
        }).filter((file) => !file.includes("node_modules"));

        const allTemplateFilesContent = allTemplateFiles.map((fileName) => {
          const filePath = Path.resolve(folderLocation, fileName as string);

          const isDirectory = Fs.lstatSync(filePath).isDirectory();

          if (isDirectory) {
            return null;
          }

          let fileContent = Fs.readFileSync(filePath).toString()

          if (fileName === 'package.json') {
            const fileObject: Record<string, Record<string, string> | string> = JSON.parse(fileContent)

            fileObject.devDependencies = {}

            fileContent = JSON.stringify(fileObject, null, 2)
          }

          return {
            path: fileName,
            content: fileContent,
          };
        });

        return { template, content: allTemplateFilesContent };
      });

    const templatesWithFiles = getTemplatesWithFiles("templates");
    const solutionTemplatesWithFiles =
      getTemplatesWithFiles("solution-templates");

    const brief = Fs.readFileSync(
      Path.resolve(
        __dirname,
        "..",
        "src",
        "seed",
        "briefs",
        `${problem.slug}.md`,
      ),
    ).toString();

    const solution = Fs.readFileSync(
      Path.resolve(
        __dirname,
        "..",
        "src",
        "seed",
        "solutions",
        `${problem.slug}.md`,
      ),
    ).toString();

    const careerPath = careerPaths.find(
      (path) => path.slug === problem.careerPath,
    )?.id;

    const problemSetsIds = problemSets
      .filter((set) => problem.problemSets.includes(set.slug))
      .map((set) => set.id);

    const problemPayload = {
      name: problem.name,
      description: problem.description,
      brief: new Showdown.Converter().makeHtml(brief),
      solution: new Showdown.Converter().makeHtml(solution),
      solutionVideoUrl: problem.solutionVideoUrl,
      techStack: problem.techStack as TechStack[],
      difficulty: problem.difficulty.toUpperCase() as Difficulty,
      completionDuration: problem.completionDuration,
    };

    // create the problem
    const upsertedProblem = await prisma.problem.upsert({
      where: {
        slug: problem.slug,
      },
      create: {
        ...problemPayload,
        slug: problem.slug,
        careerPathId: careerPath ?? null,
        problemSets: {
          connect: problemSetsIds.map((setId) => ({ id: setId })),
        },
      },
      update: problemPayload,
    });

    for (const template of templatesWithFiles) {
      Consola.start(
        `Upserting starter template ${template.template.folder} for problem: ${problem.slug}.\n`,
      );
      const upsertedTemplate = await prisma.template.upsert({
        where: {
          problemId_name: {
            problemId: upsertedProblem.id,
            name: template?.template?.folder,
          },
        },
        create: {
          default: template?.template?.default ?? false,
          name: template.template.folder,
          problemId: upsertedProblem.id,
          sandpackTemplate: template.template.sandpackTemplate,
          hiddenFiles: template.template.hiddenFiles ?? [],
          editableFiles: template.template.editableFiles ?? []
        },
        update: {
          default: template?.template?.default ?? false,
          name: template.template.folder,
          sandpackTemplate: template.template.sandpackTemplate,
          hiddenFiles: template.template.hiddenFiles ?? [],
          editableFiles: template.template.editableFiles ?? []
        },
      });

      for (const file of template.content) {
        if (file === null) {
          continue;
        }

        await prisma.file.upsert({
          where: {
            starterTemplateId_path: {
              path: file?.path as string,
              starterTemplateId: upsertedTemplate.id,
            },
          },
          create: {
            path: file.path as string,
            content: file.content,
            starterTemplateId: upsertedTemplate.id,
          },
          update: {
            path: file.path as string,
            content: file.content,
          },
        });
      }

      Consola.success(
        `Upserted template ${template.template.folder} for problem: ${problem.slug}.`,
      );
    }

    for (const template of solutionTemplatesWithFiles) {
      Consola.start(
        `Upserting solution template ${template.template.folder} for problem: ${problem.slug}.\n`,
      );
      const upsertedTemplate = await prisma.template.upsert({
        where: {
          problemId_name: {
            problemId: upsertedProblem.id,
            name: template?.template?.folder,
          },
        },
        create: {
          default: template?.template?.default ?? false,
          name: template.template.folder,
          problemId: upsertedProblem.id,
        },
        update: {
          default: template?.template?.default ?? false,
          name: template.template.folder,
        },
      });

      for (const file of template.content) {
        if (file === null) {
          continue;
        }

        await prisma.file.upsert({
          where: {
            solutionTemplateId_path: {
              path: file?.path as string,
              solutionTemplateId: upsertedTemplate.id,
            },
          },
          create: {
            path: file.path as string,
            content: file.content,
            solutionTemplateId: upsertedTemplate.id,
          },
          update: {
            path: file.path as string,
            content: file.content,
          },
        });
      }

      Consola.success(
        `Upserted solution template ${template.template.folder} for problem: ${problem.slug}.`,
      );
    }

    Consola.success(`Upserted problem: ${problem.slug}.\n`);
  }

  // await Promise.all(
  //   problemsData.map(async (problem) => {

  //   }),
  // );

  // fetch the brief and the solution
}

async function main() {
  await prisma.$connect();

  Consola.info(`Begin seeding ${careerPathsData.length} career paths ...`);

  const careerPaths = await seedCareerPaths();

  Consola.info(`Begin seeding ${careerPathsData.length} problem sets ...`);

  const problemSets = await seedProblemSets();

  Consola.info(`Begin seeding ${problemsData.length} problems ...`);

  await seedProblems(careerPaths, problemSets);

  await prisma.$disconnect();
}

main().catch(console.error);
