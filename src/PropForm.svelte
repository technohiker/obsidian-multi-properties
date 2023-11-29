<script lang="ts">
	import { tick } from "svelte";
	import PropInput from "./PropInput.svelte";
	import { NewPropData } from "./main";
	import { KNOWN_BAD_CHARACTERS, parseValue, removeExtraCommas } from "./helpers";

	export let submission: (props: Map<string, any>) => void;
	export const overwrite: boolean = true;

	let countInputs = 1; //Could replace with UUID.
	let formEl: HTMLFormElement;
	let errorEl: HTMLDivElement;
	let alertText = ".";

	//Array of objects that will be passed as props to PropInput.
	let inputEls = [
		{
			id: 1,
			isFirst: true,
			nameDef: "",
		},
	];

	/** Add new input to inputEls */
	function addInput() {
		countInputs++;

		const newInput = {
			id: countInputs,
			isFirst: false,
			nameDef: "",
		};

		inputEls = [...inputEls, newInput];
	}

	/** Remove input from inputEls */
	async function removeInput(id: number) {
		//Remove this input.
		inputEls = inputEls.filter((input) => input.id !== id);
		await tick();

		//Set focus to previous input.
		let inputs: NodeListOf<HTMLInputElement> = formEl.querySelectorAll("input");
		if (!inputs) return;

		inputs[inputs.length - 2].focus();
	}

	/** See if there are duplicate property names.*/
	function checkDuplicateNames() {
		let set = new Set();
		for (let input of inputEls) set.add(input.nameDef);

		if (set.size < inputEls.length) return true;
		else return false;
	}
	/** Remove any invalid tag characters from string.
	 */
	function cleanTags(str: string) {
		//Taken from https://github.com/Gorkycreator/obsidian-quick-tagger/
		let cleanStr = str;
		for (let index in KNOWN_BAD_CHARACTERS) {
			cleanStr = cleanStr.replaceAll(KNOWN_BAD_CHARACTERS[index], "");
		}
		return cleanStr;
	}

	/** Display an error message. */
	function runError(errorText: string) {
		alertText = errorText;
		errorEl.classList.remove("hidden"); //Should I have this error message fade away?
	}

	/** Search for all labels and values, add them to a map, then pass them back to modal.*/
	function onSubmit() {
		//Make sure there are no duplicate names.
		if (checkDuplicateNames()) {
			runError("Duplicate property names are not allowed.");
			return;
		}

		let obj: Map<string, NewPropData> = new Map();

		let inputs: NodeListOf<HTMLInputElement> = formEl.querySelectorAll(
			'input[name^="name[]"]'
		);

		inputs.forEach((input) => {
			//Check for proper inputs being next to each other.
			if (!(input.nextElementSibling instanceof HTMLInputElement)) return;
			if (!(input.previousElementSibling instanceof HTMLSelectElement)) return;
			if (
				!(input.previousElementSibling.children[0] instanceof HTMLOptionElement)
			)
				return; //TODO: Implement error handling if inputs are inaccurate?  The entire form is dependent on this structure, though.

			//Get name, value and type from inputs.
			let name = input.value;

			let value: any = parseValue(input.nextElementSibling,input.nextElementSibling.type);
			if(typeof value === "string") {
				if (name === "tags") {
				value = cleanTags(value);
				}
				if (value.contains(",")) {
					let str = removeExtraCommas(value);
					value = str.split(",");
				}
			}

			let inputType: string =
				input.previousElementSibling.children[0].innerText.toLowerCase();

			//Store data into object.
			let propObj: NewPropData = {
				type: inputType,
				data: value,
				overwrite: false,
			};

			obj.set(name, propObj);
		});
		submission(obj);
	}
</script>

<div id="multi-properties-modal" class="modal-content">
	<div id="alert-container" class="alert-container hidden" bind:this={errorEl}>
		<div>ERROR</div>
		<div id="alert-text">{alertText}</div>
	</div>
	<p>
		Type in a property name, then value. Use the dropbox to choose what type of
		data you wish to store.
	</p>
	<p>
		If you want to make a List property, use the Text data type and separate
		each value with commas.
	</p>
	<p>If you want to add Tags, use the name "tags".</p>
	<form on:submit|preventDefault bind:this={formEl}>
		<div class="modal-inputs-container">
			{#each inputEls as input (input.id)}
				<PropInput
					isFirst={input.isFirst}
					id={input.id}
					bind:nameVal={input.nameDef}
					{removeInput}
				/>
			{/each}
		</div>
		<div class="modal-add-container">
			<a on:click={addInput} class="a-btn" href="href">Add</a>
		</div>
		<div class="modal-button-container">
			<button on:click={onSubmit} class="btn-submit">Submit</button>
		</div>
	</form>
</div>

<style>
	.modal-inputs-container {
		height: 200px;
		width: 100%;
		overflow-y: scroll;
		border-radius: 5px;
		border-style: solid;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.modal-add-container {
		margin-top: 10px;
	}
	.alert-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 10px;
		background-color: red;
		font-weight: bold;
	}
	.hidden {
		display: none;
	}
</style>
