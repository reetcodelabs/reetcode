import { Dialog } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

import { Button } from "./button";
import { Modal, type ModalProps } from "./modal";

export function ConfirmAlert({ ...props }: ModalProps) {
  return (
    <Modal hideCloseIcon className="w-full sm:max-w-[36rem]" {...props}>
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
          <ExclamationTriangleIcon
            className="h-6 w-6 text-indigo-600"
            aria-hidden="true"
          />
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <Dialog.Title as="h3" className="text-base  leading-6 text-white">
            Switch template
          </Dialog.Title>
          <div className="mt-2">
            <p className=" text-slate-400">
              Are you sure you want to switch your template? Once you do, it'll
              re
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button className="sm:ml-3">Deactivate</Button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          // onClick={() => setOpen(false)}
          // ref={cancelButtonRef}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
