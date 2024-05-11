import { useSandpack } from "@codesandbox/sandpack-react";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/collapsible";
import Tube from "@/iconoir/tube.svg";
import { type ProblemWithTemplate } from "@/server/services/database";
import { axiosClient } from "@/utils/axios";
import type { TestResults } from '@/utils/rce'

interface TestCasesProps {
  problem: ProblemWithTemplate;
  template: ProblemWithTemplate["template"];
}

export function TestCases({ problem, template }: TestCasesProps) {
  const {
    sandpack: { files },
  } = useSandpack();
  const [results, setResults] = useState<TestResults | null>(null);
  const hasTestResults = results !== null;

  const executeTestsMutation = useMutation({
    async mutationFn() {
      const response = await axiosClient.post<{ data: TestResults }>(
        "/problems/execute-tests",
        {
          problemId: problem.id,
          templateId: template?.id,
          files: Object.keys(files).map((path) => ({
            path,
            code: files[path]?.code,
          })),
        },
      );

      setResults(response.data.data)

      return response.data
    },
  });

  const runTestButton = (
    <Button
      className="flex items-center px-8 py-3 font-semibold"
      isLoading={executeTestsMutation.isLoading}
      onClick={() => executeTestsMutation.mutate()}
    >
      <Tube className="mr-2" />
      Run tests
    </Button>
  );

  return (
    <div
      style={{ height: "calc(100% - 48px)" }}
      className="w-full overflow-y-auto px-6"
    >
      {hasTestResults && (
        <>
          <div className="mb-4 flex items-center justify-between pt-6">
            <div className="">
              <h3 className="text-lg font-semibold text-white">Test results</h3>
              <p className="mt-1 text-xs text-slate-400">
                {results.summary.passed}/
                {results.summary.total} test cases passed.
              </p>
            </div>

            {runTestButton}
          </div>
          <div className="grid grid-cols-1 gap-y-2 pb-8">
            {results.tests.map((testCase, idx) => {
              const testPassed = testCase.status === 'passed'

              return (
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <button
                      className="focused-link w-full rounded-t-sm border border-slate-50/[0.06] bg-slate-800 p-3 focus-within:outline-offset-0 [&[aria-expanded=false]]:rounded-b-sm [&[aria-expanded=true]>div>svg]:rotate-180"
                      key={testCase.title}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {testPassed ? (
                            <CheckCircleIcon className="h-6 w-6 stroke-current text-green-500" />
                          ) : (
                            <XCircleIcon className="h-6 w-6 stroke-current text-red-500" />
                          )}

                          <span className="ml-4 text-white">
                            {`Test case #${idx + 1} ${testPassed ? "passed" : "failed"}: ${testCase.title}`}
                          </span>
                        </div>

                        {!testPassed && (
                          <ChevronDownIcon className="h-4 w-4 text-white transition ease-linear" />
                        )}
                      </div>
                    </button>
                  </CollapsibleTrigger>
                  {testCase?.errorMessage && (
                    <CollapsibleContent className="rounded-b-sm bg-slate-800">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: testCase.errorMessageHtml ?? "",
                        }}
                        className="[&>pre]:overflow-x-auto [&>pre]:p-4"
                      ></div>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              );
            })}
          </div>
        </>
      )}
      {!hasTestResults && (
        <div className="mx-auto mt-24 max-w-lg text-center">
          <h3 className="mb-3 mt-2 text-xl font-semibold text-white">
            No tests have been run yet
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Running tests will check that your code meets the requirements of
            the problem brief. Once you are ready to check your work, click the
            "Run tests" button to run all automated tests.
          </p>
          <div className="mt-6 flex justify-center">{runTestButton}</div>
        </div>
      )}
    </div>
  );
}
