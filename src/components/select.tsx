import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { Fragment } from "react";
export interface SelectOption {
  id: string;
  name: string;
}

export function Select({
  options = [],
  onChange,
  value,
  label = "Select an option",
}: {
  options?: SelectOption[];
  value?: SelectOption;
  label?: string;
  onChange?: (selected: SelectOption) => void;
}) {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only block  font-medium leading-6 text-slate-400">
            {label}
          </Listbox.Label>
          <div className="relative w-full">
            <Listbox.Button className="sm: relative h-12 w-full cursor-default rounded-md bg-slate-900 py-1 pl-6 pr-10 text-left text-white shadow-sm ring-1 ring-inset ring-slate-50/[0.06] focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:leading-6">
              <span className="block truncate">{value?.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-slate-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="sm: absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-900 py-1 text-base ring-1 ring-slate-50/[0.06] ring-opacity-5 focus:outline-none">
                {options.map((item) => (
                  <Listbox.Option
                    key={item.id}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-indigo-600 text-white" : "text-slate-400",
                        "relative cursor-default select-none py-3 pl-3 pr-9",
                      )
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "" : "font-normal",
                            "block truncate",
                          )}
                        >
                          {item.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4",
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
