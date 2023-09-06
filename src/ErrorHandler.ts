/** Errors are handled by logging each instance of an error into this class. */
export class ErrorLogger {
	errors: string[] = [];

	constructor() {
		this.errors = [];
	}

	public addError(error: string) {
		this.errors.push(error);
	}

	public getErrors() {
		return this.errors;
	}

	public clearErrors() {
		this.errors = [];
	}
}
