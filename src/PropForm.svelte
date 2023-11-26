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
			//Check for 2 inputs being next to each other.
			if(!(input.nextElementSibling instanceof HTMLInputElement)) return;

			let name = input.value;
			let value = parseValue(
				input.nextElementSibling,
				input.nextElementSibling.type
			);

			//Push to obj if name wasn't already added.
			//If same name was used multiple times, we will instead add a list of values.
			if(!obj.has(name)) obj.set(name,value);

			//Return if user tries to add a non-value to a list.
			if (value === "") return;

			let curVal = obj.get(name);
			let arr = Array.isArray(curVal) ? curVal : [curVal];
			
			arr.push(value);
			obj.set(name, arr);
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

	.modal-add-container {
		margin-top: 10px;
	}
</style>
