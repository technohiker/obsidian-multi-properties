<script lang="ts">
	import { onMount, tick } from "svelte";

	export let isFirst: boolean;
	export let removeInput: (id: number) => void;
	export let id: number;

	export let typeVal: string = "text"
	export let nameVal: string = "";
	export let valueVal: string = ""

	//let inputType: string;
	let inputEl: HTMLInputElement;

	let valueEl: HTMLInputElement;
	let selectEl: HTMLSelectElement

	const options: Record<string, string> = {
		text: "string",
		multitext: "string",
		number: "number",
		checkbox: "checkbox",
		date: "date",
		datetime: "datetime-local",
	};

	// const options: Record<string, string> = {
	// 	string: "text",
	// 	number: "number",
	// 	checkbox: "checkbox",
	// 	date: "date",
	// 	Datetime: "datetime-local"
	// }

	//Set focus on input when modal is opened so user can immediately type into it.
	onMount(async () => {
		console.log({typeVal})
		await tick();
		inputEl.focus();
		inputEl.select();
		console.log(selectEl.value)
	});

	function changeType(type: string){
		//valueEl.type = type
		valueEl.type = options[type]
		// console.log({type})
		// console.log(options)
		// console.log(options[type])
	}
</script>

<div class="modal-input-container">
	<a
		id="del-btn"
		on:click={() => (isFirst ? false : removeInput(id))}
		class="btn-del {isFirst ? 'btn-inactive' : ''}"
		tabindex={isFirst ? -1 : 0}
		href="href">X</a
	>
	<select bind:this={selectEl} id="type-input" class="flex-obj" bind:value={typeVal} on:change={() => changeType(typeVal)}>
		{#each Object.keys(options) as key}
			<option value={options[key]}>{key}</option>
		{/each}
	</select>
	<input
		id="name-input"
		bind:this={inputEl}
		class="name-input flex-obj"
		type="text"
		name="name[]"
		placeholder="name"
		bind:value={nameVal}
		required
	/>
	<input bind:this={valueEl}
		id="value-input"
		type="text"
		name="value[]"
		placeholder="value"
		bind:value={valueVal}
		class="value-input flex-obj"
	/>
</div>

<style>
	input {
		max-height: 25px;
		overflow-x: auto;
	}

	select {
		height: 21px;
	}

	#name-input {
		flex-grow: 0;
		width: auto;
	}

	.modal-input-container {
		width: 95%;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
		margin-top: 10px;
	}

	.btn-inactive {
		cursor: not-allowed;
		pointer-events: none;
		opacity: 0.7;
	}
</style>
