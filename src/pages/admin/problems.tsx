import { PlusIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Select } from "@/components/select";
import { Textarea } from "@/components/textarea";
import { cn } from "@/lib/utils";
import {
  databaseService,
  type ProblemWithTemplate,
  type TemplateWithStarterFiles,
} from "@/server/services/database";
import { withIronSessionSsr } from "@/utils/session";

interface AdminProblemsProps {
  problems: ProblemWithTemplate[];
}

export default function AdminProblems({ problems }: AdminProblemsProps) {
  const [searchProblems, setSearchProblems] = useState("");
  const [selectedProblem, setSelectedProblem] =
    useState<ProblemWithTemplate | null>(null);
  const [selectedTemplateFilesType, setSelectedTemplateFilesType] = useState<
    "solution" | "problem" | null
  >(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateWithStarterFiles | null>(null);

  const filteredProblems = useMemo(() => {
    if (!searchProblems) {
      return problems;
    }
    return problems.filter((problem) =>
      problem.name?.toLowerCase().match(searchProblems.toLowerCase()),
    );
  }, [searchProblems]);

  return (
    <div className="flex h-screen items-center">
      <div className={cn("h-full w-1/6 border-r border-slate-50/[0.06]", {})}>
        <div className="flex h-12 space-x-2 border-b border-slate-50/[0.06] p-2">
          <Input
            className="h-full text-xs placeholder:text-white/70"
            placeholder="Search problems..."
            type="search"
            onChange={(event) => setSearchProblems(event.target.value)}
          />

          {searchProblems && (
            <Button
              variant="secondary"
              onClick={() => setSearchProblems("")}
              className="flex flex-shrink-0 items-center justify-center"
            >
              <XCircleIcon className="h-5 w-5" />
            </Button>
          )}
        </div>
        {filteredProblems.map((problem) => {
          return (
            <button
              key={problem?.id}
              onClick={() => setSelectedProblem(problem)}
              className={cn(
                "h-10 w-full border-b border-slate-50/[0.06] px-3 text-left text-xs text-white hover:bg-slate-50/[0.06]",
                {
                  "bg-slate-50/[0.06]": selectedProblem?.id === problem.id,
                },
              )}
            >
              {problem.name}
            </button>
          );
        })}

        <div
          className={cn(
            "flex items-center border-b border-slate-50/[0.06] p-3",
          )}
        >
          <Button className="flex h-10 w-full items-center justify-center">
            <PlusIcon className="mr-2 h-5 w-5" />
            <p>Add new problem</p>
          </Button>
        </div>
      </div>
      <div className="flex h-full flex-grow">
        {selectedProblem && (
          <div className="h-full w-2/5 flex-col overflow-y-auto border-r border-slate-50/[0.06]">
            <header className="sticky top-0 z-[2] flex h-12 items-center justify-between border-b border-slate-50/[0.06] bg-slate-900 px-6">
              <h1 className=" text-white">{selectedProblem?.name}</h1>

              <Button>Save changes</Button>
            </header>

            <form action="" className="grid grid-cols-1 gap-6 px-6 py-6">
              <div className="flex w-full flex-col">
                <Label htmlFor="problemName" className="mb-4 text-white">
                  Name
                </Label>
                <Input id="problemName" />
              </div>
              <div className="flex w-full flex-col">
                <Label htmlFor="problemSlug" className="mb-4 text-white">
                  Slug
                </Label>
                <Input id="problemSlug" />
              </div>

              <div className="flex w-full flex-col">
                <Label htmlFor="problemDescription" className="mb-4 text-white">
                  Description
                </Label>
                <Textarea id="problemDescription" />
              </div>

              <div className="flex w-full flex-col">
                <Label htmlFor="problemBrief" className="mb-4 text-white">
                  Brief
                </Label>
                <Textarea id="problemBrief" />
              </div>

              <div className="flex w-full flex-col">
                <Label htmlFor="problemSolution" className="mb-4 text-white">
                  Solution
                </Label>
                <Textarea id="problemSolution" />
              </div>

              <div className="flex w-full flex-col">
                <Label
                  htmlFor="problemSolutionVideoUrl"
                  className="mb-4 text-white"
                >
                  Solution Video Url
                </Label>
                <Input id="problemSolutionVideoUrl" />
              </div>

              <div className="flex w-full flex-col">
                <Label htmlFor="problemDifficulty" className="mb-4 text-white">
                  Difficulty
                </Label>
                <Select
                  options={[
                    { name: "Easy", id: "EASY" },
                    { name: "Medium", id: "MEDIUM" },
                    { name: "Hard", id: "HARD" },
                  ]}
                />
              </div>

              <div>
                {selectedProblem.templates?.map((template) => {
                  const isSelectedProblemTemplate =
                    selectedTemplateFilesType === "problem" &&
                    template?.id === selectedTemplate?.id;
                  const isSelectedSolutionTemplate =
                    selectedTemplateFilesType === "solution" &&
                    template?.id === selectedTemplate?.id;

                  return (
                    <div className="flex items-center" key={template?.id}>
                      <button
                        type="button"
                        className={cn(
                          "flex h-10 w-full items-center border border-slate-50/[0.06] px-4 text-xs capitalize text-white",
                          {
                            "bg-slate-50/[0.06]": isSelectedProblemTemplate,
                          },
                        )}
                        onClick={() => {
                          setSelectedTemplate(
                            template as unknown as TemplateWithStarterFiles,
                          );
                          setSelectedTemplateFilesType("problem");
                        }}
                      >
                        Template files:{" "}
                        <span className="">{template.name}</span>
                        {isSelectedProblemTemplate && (
                          <CheckIcon className="ml-2 h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        className={cn(
                          "flex h-10 w-full items-center border border-slate-50/[0.06] px-4 text-xs capitalize text-white",
                          {
                            "bg-slate-50/[0.06]": isSelectedSolutionTemplate,
                          },
                        )}
                        onClick={() => {
                          setSelectedTemplate(
                            template as unknown as TemplateWithStarterFiles,
                          );
                          setSelectedTemplateFilesType("solution");
                        }}
                      >
                        Solution files:{" "}
                        <span className="">{template.name}</span>
                        {isSelectedSolutionTemplate && (
                          <CheckIcon className="ml-2 h-4 w-4" />
                        )}
                      </button>
                    </div>
                  );
                })}

                <Button
                  type="button"
                  className="mt-4 flex w-full items-center justify-center"
                >
                  <PlusIcon className="h-4 w-4" /> Add a template
                </Button>
              </div>
            </form>
          </div>
        )}
        <div className="flex h-full flex-grow overflow-hidden">
          {selectedTemplate && (
            <div className="flex w-full flex-col overflow-y-auto">
              <header className="sticky top-0 z-[2] flex h-12 w-full flex-shrink-0 items-center justify-between border-b border-slate-50/[0.06] bg-slate-900 px-6">
                <h1 className=" text-white">
                  <span>
                    {selectedTemplateFilesType === "problem"
                      ? "Problem files for template:"
                      : "Solution files for template:"}
                  </span>{" "}
                  {selectedTemplate?.name}
                </h1>

                <div className="space-x-4">
                  <Button variant="secondary">Delete</Button>
                  <Button>Save template files</Button>
                </div>
              </header>

              <div className="w-full">
                {(selectedTemplateFilesType === "problem"
                  ? selectedTemplate?.starterFiles
                  : selectedTemplate?.solutionFiles
                ).map((file) => (
                  <div className="flex w-full flex-col border-b border-white p-6">
                    <Input
                      defaultValue={file.path}
                      className="mb-4 text-white"
                    />
                    <Textarea
                      className="w-full"
                      key={file.id}
                      id={`filePath-${file.id}`}
                      defaultValue={file.content}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps(ctx) {
    const problems = await databaseService.getAllProblems(
      {},
      {
        templates: {
          select: {
            id: true,
            name: true,
            sandpackTemplate: true,
            starterFiles: true,
            solutionFiles: true,
          },
        },
      },
    );

    return {
      props: {
        session: ctx.req.session,
        problems,
      },
    };
  },
);
