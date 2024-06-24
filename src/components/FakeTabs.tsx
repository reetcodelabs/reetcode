import { type ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

import { Select } from "./select";

export interface PanelTab {
  key: string;
  title: string;
  icon?: () => React.ReactNode;
}

export interface PanelTabsProps {
  defaultActiveKey?: string;
  tabs: PanelTab[];
  children?: (props: {
    activeTab: PanelTab | undefined;
    classNames: (key: string) => string;
  }) => ReactNode;
  onTabSelected?: (tab: PanelTab) => void;
}

export function FakeTabs({
  tabs,
  onTabSelected,
  children,
  defaultActiveKey,
}: PanelTabsProps) {
  const [activeTab, setActiveTab] = useState(() => {
    return tabs?.find((tab) => tab?.key === defaultActiveKey) ?? tabs?.[0];
  });

  return (
    <>
      <div className="sticky top-0 z-[2] hidden h-10 w-full flex-shrink-0 items-center border-b border-r border-slate-50/[0.06] bg-slate-900 md:flex xl:h-12">
        {tabs.map((tab) => {
          return (
            <button
              key={tab.key}
              className={cn(
                "flex h-full items-center px-3  text-white transition ease-linear hover:bg-slate-50/[0.06]",
                {
                  "border-l border-r border-slate-50/[0.06] bg-slate-50/[0.06]":
                    tab.key === activeTab?.key,
                },
              )}
              onClick={() => {
                setActiveTab(tab);
                onTabSelected?.(tab);
              }}
            >
              {tab?.icon?.()}
              {tab.title}
            </button>
          );
        })}
      </div>

      <div className="sticky top-0 z-[2] h-10 w-full md:hidden xl:h-12">
        <Select
          options={tabs.map((tab) => ({
            id: tab.key,
            name: tab.title,
            ...tab,
          }))}
          onChange={(selected) => {
            const tab = tabs.find((tab) => tab.key === selected.id);

            if (!tab) {
              return;
            }
            setActiveTab(tab);
            onTabSelected?.(tab);
          }}
          value={
            activeTab ? { id: activeTab.key, name: activeTab.title } : undefined
          }
        />
      </div>

      {children?.({
        activeTab,
        classNames(key: string) {
          return key === activeTab?.key
            ? "w-full h-full opacity-1 pointer-events-auto"
            : "w-[0] h-[0] opacity-0 pointer-events-none absolute top-0 left-0";
        },
      })}
    </>
  );
}
