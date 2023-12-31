import * as defaultThemes from "@codesandbox/sandpack-themes";
import { useMemo, useState } from "react";

import { type SelectOption } from "@/components/select";

export const listOfThemes = [
  {
    id: "atomDark",
    name: "Atom Dark",
  },
  {
    id: "nightOwl",
    name: "Night Owl",
  },
  {
    id: "amethyst",
    name: "Amethyst",
  },
  {
    id: "aquaBlue",
    name: "Aqua Blue",
  },
  {
    id: "cobalt2",
    name: "Cobalt 2",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
  },
  {
    id: "dracula",
    name: "Dracula",
  },
  {
    id: "ecoLight",
    name: "Ecolight",
  },
  {
    id: "freeCodeCampDark",
    name: "Freecodecamp Dark",
  },
  {
    id: "githubLight",
    name: "Github Light",
  },
  {
    id: "gruvboxDark",
    name: "Gruvbox Dark",
  },
  {
    id: "gruvboxLight",
    name: "Gruvbox Light",
  },
  {
    id: "levelUp",
    name: "Level Up",
  },
  {
    id: "monokaiPro",
    name: "Monokai Pro",
  },
  {
    id: "neoCyan",
    name: "Neo Cyan",
  },

  {
    id: "sandpackDark",
    name: "Sandpack Dark",
  },
];

export function useSandpackTheme() {
  const themes = useMemo(() => listOfThemes, []);
  const sandpackThemes = useMemo(() => defaultThemes, []);

  const [theme, setTheme] = useState<SelectOption>(
    () => themes.find((theme) => theme?.id === "sandpackDark") ?? themes[0]!,
  );

  return { theme, setTheme, themes, sandpackThemes };
}

export type SandpackThemeKey = keyof typeof defaultThemes;
