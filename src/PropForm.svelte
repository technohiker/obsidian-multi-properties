<script lang="ts">
	import PropInput from "./PropInput.svelte";
	import { parseValue } from "./helpers";

	export let closeModal: () => void;
	export let submission: () => void;
	export const override: boolean = true;

	let countInputs = 1;

	//Array of objects that will be passed as props to PropInput.
	let inputEls = [
		{
			id: 1,
			isNew: false,
		},
	];

	function addInput() {
		countInputs++;

		//Add new input to inputEls
		const newInput = {
			id: countInputs,
			isNew: true,
		};

		inputEls = [...inputEls, newInput];

		console.log({ inputEls });

		//Set tab index to newDiv's first input.
	}

	function removeInput(id: number) {
		//Set focus to previous input before deleting.
		console.log({ id });

		//Remove this input.
		inputEls = inputEls.filter((input) => input.id !== id);
	}

	function onSubmit() {
		
		//Search for all labels and values, add them to a map, then pass them back to modal.
		let obj = new Map();

		let inputs: NodeListOf<HTMLInputElement> = this.querySelectorAll(
			'input[name^="name[]"]'
		);

		inputs.forEach((input) => {
			let name = input.value;
			if (input.nextElementSibling instanceof HTMLInputElement) {
				let value = parseValue(
					input.nextElementSibling.value,
					input.nextElementSibling.type
				);

				if (value === "") return; //Do not add properties with no value.

				//Create list if a property name already exists.  Assuming user wants to add it to list.
				//TODO: Toggle this if user wants to override property or add to it.
				if (obj.has(name)) {
					let arr = [obj.get(name)];
					arr.push(value);
					obj.set(name, arr);
				} else {
					obj.set(name, value);
				}
			}
		});
		submission();
	}
</script>

<div class="modal-content">
	<p>
		Type in a property name, then value. Use the dropbox to choose what type of
		data you wish to store.
	</p>
	<p>
		If you want to make a List property, use the same name for each entry to the
		list.
	</p>
	<p>If you want to add Tags, use the name "tags".</p>
	<form>
		<div class="modal-inputs-container">
			{#each inputEls as input (input.id)}
				<PropInput {...input} {removeInput} />
			{/each}
		</div>
		<div class="modal-add-container">
			<a on:click={addInput} class="a-btn" href="href">Add</a>
		</div>
		<div class="modal-button-container">
			<button on:click={onSubmit} class="btn-submit">Submit</button>
			<button on:click={closeModal} class="btn-cancel">Cancel</button>
		</div>
	</form>
</div>
