import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { type Dispatch, type SetStateAction, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-select";
import { type ProblemWithTemplate } from "@/server/services/database";

import { Button } from "../button";
import { Modal } from "../modal";
import { type SelectOption } from "../select";

export interface StartProblemInOnlineEditorProps {
  isOpen: boolean;
  problem: ProblemWithTemplate;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function StartProblemInOnlineEditor({
  isOpen,
  problem,
  setIsOpen,
}: StartProblemInOnlineEditorProps) {
  const { push } = useRouter();
  const [template, setTemplate] = useState<SelectOption>(
    () =>
      problem.problemTemplates.find((template) => template.default === true)!,
  );

  const startProblemMutation = useMutation({
    async mutationFn() {
      // call api to start challenge for user.
      //
      await push(
        `/problems/${problem?.slug}/editor?template=${template?.name}`,
      );
    },
  });

  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      className="w-full overflow-auto sm:max-w-[32rem]"
    >
      <div className="mb-6 mt-4">
        <h2 className="text-lg  text-white">{problem?.name}</h2>
        <p className=" text-slate-400">
          Download problem using the Reetcode CLI
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor="Select" className="mb-3 inline-block  text-white">
          Select a template
        </label>

        {/* <Select
          options={
            problem?.problemTemplates.map((template) => ({
              id: template.id,
              name: template.name,
            })) ?? []
          }
          value={template}
          onChange={setTemplate}
        /> */}
        <Select
          onValueChange={(value) => {
            setTemplate(
              problem.problemTemplates.find((t) => t.name === value)!,
            );
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Template" />
          </SelectTrigger>
          <SelectContent>
            {problem?.problemTemplates?.map((template) => (
              <SelectItem value={template?.name} className="capitalize">
                {template?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        isLoading={startProblemMutation.isLoading}
        onClick={() => startProblemMutation.mutate()}
        className="flex w-full items-center justify-center py-3"
      >
        Start solving problem <ArrowRightIcon className="ml-2 h-6 w-6" />{" "}
      </Button>
    </Modal>
  );
}
