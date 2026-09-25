/** Return value from HTML input based on the input's type. */
export function parseValue(input: HTMLInputElement, type: string) {
  switch (type) {
    case "number":
      return Number(input.value);
    case "checkbox":
      return Boolean(input.checked);
    default:
      return input.value;
  }
}

/** Remove leading and trailing commas, then replace multiple consecutive commas with a single comma.*/
export function removeExtraCommas(str: string): string {
  return str.replace(/^,*(.*?),*$/g, "$1").replace(/,{2,}/g, ",");
}

export function fuzzySearch(str: string, arr: string[], idx: number): string {
  return (
    arr.find((s, idx) => s.toLowerCase().includes(str.toLowerCase())) || ""
  );
}

/** Remove any invalid tag characters from string.*/
export function cleanTags(str: string) {
  //Taken from https://github.com/Gorkycreator/obsidian-quick-tagger/
  let cleanStr = str;
  for (let i = 0; i < KNOWN_BAD_CHARACTERS.length; i++) {
    cleanStr = cleanStr.replaceAll(KNOWN_BAD_CHARACTERS[i], "");
  }
  return cleanStr;
}

//Taken from https://github.com/Gorkycreator/obsidian-quick-tagger/.
//Commas removed.  Will instead be handled by removeExtraCommas.
const KNOWN_BAD_CHARACTERS = [
  "‒",
  "–",
  "—",
  "―",
  "⁏",
  "‽",
  "‘",
  "‚",
  "‛",
  "‹",
  "›",
  "“",
  "”",
  "„",
  "‟",
  "⁅",
  "⁆",
  "⁋",
  "⁎",
  "⁑",
  "⁄",
  "⁊",
  "‰",
  "‱",
  "⁒",
  "†",
  "‡",
  "•",
  "‣",
  "⁃",
  "⁌",
  "⁍",
  "′",
  "‵",
  "‸",
  "※",
  "⁐",
  "⁁",
  "⁂",
  "‖",
  "‑",
  "″",
  "‴",
  "⁗",
  "‶",
  "‷",
  "`",
  "^",
  "‾",
  "‗",
  "⁓",
  ";",
  ":",
  "!",
  "‼",
  "⁉",
  "?",
  "⁈",
  "⁇",
  ".",
  "․",
  "‥",
  "…",
  "'",
  '"',
  "(",
  ")",
  "[",
  "]",
  "{",
  "}",
  "@",
  "*",
  "&",
  "%",
  "⁔",
  "+",
  "<",
  "=",
  ">",
  "|",
  "~",
  "$",
  "⁕",
  "⁖",
  "⁘",
  "⁙",
  "⁚",
  "⁛",
  "⁜",
  "⁝",
  "⁞",
  "⸀",
  "⸁",
  "⸂",
  "⸃",
  "⸄",
  "⸅",
  "⸆",
  "⸇",
  "⸈",
  "⸉",
  "⸊",
  "⸋",
  "⸌",
  "⸍",
  "⸎",
  "⸏",
  "⸐",
  "⸑",
  "⸒",
  "⸓",
  "⸔",
  "⸕",
  "⸖",
  "⸗",
  "⸜",
  "⸝",
  " ",
  "#",
];
