import Axios from "axios";
import { codeToHtml } from "shiki";

import { env } from "@/env";

export const rceClient = Axios.create({
  baseURL: `${env.RCE_API_URL}/api`,
});

const TEST_RESULTS_DELIMITER = "TEST_RESULTS_DELIMITER";

export const STUBS = {
  "test.js": `import { expect } from "@japa/expect";
import * as reporters from "@japa/runner/reporters";
import { configure, processCLIArgs, run } from "@japa/runner";

processCLIArgs(process.argv.splice(2));

configure({
  files: ["tests/**/*.spec.js"],
  plugins: [expect()],
  reporters: {
    activated: ["ndjson"],
    list: [reporters.spec(), reporters.ndjson(), reporters.dot()]
  }
});

run();
`,
  "test.jest.js": `import jest from 'jest'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const {runCLI} = jest;

runCLI({
 roots: [path.resolve(__dirname, 'tests')],
 json: true,
 testEnvironment: 'jsdom',
 outputFile: path.resolve(__dirname, 'tests.output.json')
 // testRegex: '\\.spec\\.{ts,js,tsx}$'
}, [path.resolve(__dirname)]).finally(() => {
 console.log('${TEST_RESULTS_DELIMITER}')
 console.log(fs.readFileSync(
  path.resolve(__dirname, 'tests.output.json')
 ).toString())
})
`,
  "babel.config.json": `{
  "presets": [
    ["@babel/preset-env", { "targets": { "node": "current" } }],
    "@babel/preset-typescript",
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
`,
  "test.mjs": `import { startVitest } from "vitest/node";
import Fs from "fs";

const vitest = await startVitest("test", {}, { run: true });

await vitest?.close();

const output = Fs.readFileSync("test.output.json").toString();

console.log("${TEST_RESULTS_DELIMITER}");
console.log(output);
`
};

const parseNdJson = <T>(jsonString: string) => {
  const type = typeof jsonString;
  if (type !== "string")
    throw new Error(`Input have to be string but got ${type}`);

  const jsonRows = jsonString.split(/\n|\n\r/).filter(Boolean);
  return jsonRows.map((jsonStringRow) => JSON.parse(jsonStringRow) as T);
};

export interface TestResult {
  title: string;
  status: "passed" | "failed";
  errorMessage?: string;
  errorMessageHtml?: string;
  description: string;
}

export interface TestSummary {
  failed: number;
  passed: number;
  total: number;
}

export interface TestResults {
  rawOutput: string;
  rawOutputHtml: string;
  summary: TestSummary;
  tests: TestResult[];
}

interface JapaTestSummary {
  aggregates: {
    failed: number;
    passed: number;
    regression: number;
    skipped: number;
    todo: number;
    total: number;
  };
  duration: number;
  failedTestsTitles: string[];
  hasError: boolean;
}

interface JapaTestResult {
  event: string;
  name: string;
  title: {
    original: string;
    expanded: string;
  };
  duration: number;
  errors: {
    phase: string;
    error: {
      name: string;
      message: string;
      stack: string;
      matcherResult: {
        actual: unknown;
        expected: unknown;
        message: string;
        pass: boolean;
      };
    };
  }[];
}

export interface JapaParsedTestResult {
  tests: JapaTestResult[];
  summary: JapaTestSummary;
}

export interface JestParsedTestSummary {
  runnerOutput: string;
}

export interface JestParsedTestResult {
  tests: string[];
  summary: JestParsedTestSummary;
  runnerOutput: string;
  numFailedTests: number;
  numPassedTests: number;
  numTotalTests: number;
  testResults: {
    assertionResults: {
      title: string;
      status: "failed" | "passed";
      failureMessages: string[];
    }[];
  }[];
}

function sanitizeOutput(output: string) {
  // Clean up all references to the path of the file locations.
  return output.replace(/\/code\/code_executor_\d{5}/g, "");
}

export async function parseRuntimeOutputJestTests(
  output: string,
): Promise<TestResults> {
  const [rawOutput, jsonOutput] = sanitizeOutput(output).split(
    TEST_RESULTS_DELIMITER,
  );

  let results: JestParsedTestResult = {
    tests: [],
    summary: {
      runnerOutput: "",
    },
    numFailedTests: 0,
    numPassedTests: 0,
    numTotalTests: 0,
    testResults: [],
    runnerOutput: "",
  };

  try {
    results = JSON.parse(jsonOutput ?? "") as JestParsedTestResult;
  } catch (error) { }

  const tests = results.testResults[0]?.assertionResults ?? [];

  return {
    tests: await Promise.all(
      tests.map(async (result) => {
        const errorMessage = result?.failureMessages?.[0] ?? "";

        return {
          title: result.title,
          status: result.status,
          description: "",
          errorMessage,
          errorMessageHtml: await codeToHtml(errorMessage, {
            lang: "bash",
            theme: "monokai",
          }),
        };
      }),
    ),
    rawOutput: rawOutput ?? "",
    rawOutputHtml: await codeToHtml(rawOutput ?? "", {
      lang: "bash",
      theme: "monokai",
    }),
    summary: {
      failed: results.numFailedTests,
      passed: results.numPassedTests,
      total: results.numTotalTests,
    },
  };
}

export function parseRuntimeOutputJapaTests(
  output: string,
): JapaParsedTestResult {
  const results = parseNdJson<JapaTestResult>(output);

  const tests = results.filter((result) => result.event === "test:end");

  const summary = results.find(
    (result) => (result as unknown as JapaTestSummary).aggregates,
  );

  return {
    tests,
    summary: summary as unknown as JapaTestSummary,
  };
}
