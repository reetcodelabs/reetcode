import {
  CheckCircleIcon,
  ChevronDownIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export function TestCases() {
  return (
    <div className="w-full px-6">
      <div className="mb-4 pt-6">
        <h3 className="text-lg font-semibold">Test results</h3>
        <p className="mt-1 text-xs text-slate-400">0/10 test cases passed.</p>
      </div>
      <div className="grid grid-cols-1 gap-y-2 pb-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((x, idx) => (
          <button
            className="focused-link w-full rounded-sm border border-slate-50/[0.06] bg-slate-800 p-3 focus-within:outline-offset-0"
            key={x}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {x % 2 === 0 ? (
                  <CheckCircleIcon className="h-6 w-6 stroke-current text-green-500" />
                ) : (
                  <XCircleIcon className="h-6 w-6 stroke-current text-red-500" />
                )}

                <span className="ml-4">
                  {x % 2 === 0
                    ? "Test case #1 passed: A user can see a list of all quizzes."
                    : "Test case #2 failed: A user can add a discount code"}
                </span>
              </div>

              <ChevronDownIcon className="h-4 w-4 text-white transition ease-linear" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
