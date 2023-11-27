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
