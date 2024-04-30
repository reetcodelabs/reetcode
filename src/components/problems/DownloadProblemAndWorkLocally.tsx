import {
  ArrowRightIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/20/solid";
import { type Dispatch, type SetStateAction, useState } from "react";
import toast from "react-hot-toast";

import { Modal } from "@/components/modal";
import { type ProblemWithTemplate } from "@/server/services/database";

import { Alert } from "../Notification";
import { Select, type SelectOption } from "../select";

export interface DownloadProblemAndWorkLocallyProps {
  problem: ProblemWithTemplate;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function DownloadProblemAndWorkLocally({
  problem,
  isOpen,
  setIsOpen,
}: DownloadProblemAndWorkLocallyProps) {
  const [template, setTemplate] = useState<SelectOption>(
    () =>
      problem.problemTemplates.find((template) => template.default === true)!,
  );

  const command = `reetcode download --problem=${problem?.slug} --template=${template?.name}`;

  async function copyApiKeyToClipboard() {
    if (!navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(command);

    toast.custom(
      () => (
        <Alert
          variant="success"
          title="Success."
          description="Command copied to clipboard !"
        />
      ),
      { position: "top-center" },
    );
  }

  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      className="w-full overflow-auto sm:max-w-[32rem]"
    >
      <div className="mb-6 mt-4">
        <h2 className="text-lg font-semibold text-white">{problem?.name}</h2>
        <p className="text-sm text-slate-400">
          Download problem using the Reetcode CLI
        </p>
      </div>

      <div className="mb-6">
        <label
          htmlFor="Select"
          className="mb-3 inline-block text-sm text-white"
        >
          Select a template
        </label>
        <Select
          options={
            problem?.problemTemplates.map((template) => ({
              id: template.id,
              name: template.name,
            })) ?? []
          }
          value={template}
          onChange={setTemplate}
        />
      </div>

      <div className="mb-6">
        <a href="https://reetcode.com/cli" className="group" target="_blank">
          <Alert
            variant="info"
            asToast={false}
            title="Make sure you have the CLI installed."
          >
            <p>
              You may use the Reetcode CLI to download problems locally, solve
              them in your own environment, and submit.
            </p>

            <p className="mt-4 flex items-center underline">
              Read our fast easy guide to download and install the CLI{" "}
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </p>
          </Alert>
        </a>
      </div>

      <div className="mb-6">
        <button
          onClick={copyApiKeyToClipboard}
          className="mt-5 flex w-full items-center justify-between rounded bg-slate-800 p-4 text-sm text-white transition ease-linear hover:bg-slate-700"
        >
          <span className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-sm text-white">
            {command}
          </span>
          <ClipboardDocumentCheckIcon className="ml-4 h-6 w-6 flex-shrink-0" />
        </button>

        <a
          target="_blank"
          href="https//reetcode.com/cli"
          className="mt-2 flex w-full items-center text-sm text-slate-400 "
        >
          Learn more about solving problems locally
          <ArrowRightIcon className="ml-2 h-6 w-6" />
        </a>
      </div>
    </Modal>
  );
}
