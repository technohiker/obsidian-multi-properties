<script lang="ts">
	import { tick } from "svelte";
	import PropInput from "./PropInput.svelte";
	import { parseValue } from "./helpers";

	export let submission: (props: Map<string, any>) => void;
	export const override: boolean = true;

	let countInputs = 1; //Could replace with UUID.
	let formEl: HTMLFormElement;

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
			nameDef: inputEls[inputEls.length - 1].nameDef,
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

	function onSubmit() {
		//Search for all labels and values, add them to a map, then pass them back to modal.
		let obj = new Map();

		let inputs: NodeListOf<HTMLInputElement> = formEl.querySelectorAll(
			'input[name^="name[]"]'
		);

		inputs.forEach((input) => {
			let name = input.value;
			if (input.nextElementSibling instanceof HTMLInputElement) {
				let value = parseValue(
					input.nextElementSibling,
					input.nextElementSibling.type
				);

				if (value === "") return; //Do not add properties with no value.

				//Create list if a property name already exists.  Assuming user wants to add it to list.
				if (obj.has(name)) {
					let arr = [];
					let curVal = obj.get(name);

					if (Array.isArray(curVal)) {
						arr = curVal;
					} else {
						arr = [curVal];
					}

					arr.push(value);
					obj.set(name, arr);
				} else {
					obj.set(name, value);
				}
			}
		});
		submission(obj);
	}
</script>

<div id="multi-properties-modal" class="modal-content">
	<p>
		Type in a property name, then value. Use the dropbox to choose what type of
		data you wish to store.
	</p>
	<p>
		If you want to make a List property, use the same name for each entry to the
		list.
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
</style>
