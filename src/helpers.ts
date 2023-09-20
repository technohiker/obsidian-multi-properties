export function parseValue(value: string, type: string) {
	console.log({ value, type });
	switch (type) {
		case "number":
			return Number(value);
		case "checkbox":
			return Boolean(value);
		default:
			return value;
	}
}
