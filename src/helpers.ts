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

export function removeExtraCommas(str: string): string {
	// Remove leading and trailing commas, then replace multiple consecutive commas with a single comma
	return str.replace(/^,*(.*?),*$/g, "$1").replace(/,{2,}/g, ",");
}

/** Remove any invalid tag characters from string.
 */
export function cleanTags(str: string) {
	//Taken from https://github.com/Gorkycreator/obsidian-quick-tagger/
	let cleanStr = str;
	for (let index in KNOWN_BAD_CHARACTERS) {
		cleanStr = cleanStr.replaceAll(KNOWN_BAD_CHARACTERS[index], "");
	}
	return cleanStr;
}

//Taken from https://github.com/Gorkycreator/obsidian-quick-tagger/
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
