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
