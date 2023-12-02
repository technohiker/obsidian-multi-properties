<script lang="ts">
	import { onMount, tick } from "svelte";

	export let isFirst: boolean;
	export let removeInput: (id: number) => void;
	export let id: number;
	export let nameVal: string = "";

	let inputType: string;
	let inputEl: HTMLInputElement;

	const options: Record<string, string> = {
		Text: "string",
		Number: "number",
		Checkbox: "checkbox",
		Date: "date",
		Datetime: "datetime-local",
	};

	//Set focus on input when modal is opened so user can immediately type into it.
	onMount(async () => {
		await tick();
		inputEl.focus();
		inputEl.select();
	});
</script>

<div class="modal-input-container">
	<a
		id="del-btn"
		on:click={() => (isFirst ? false : removeInput(id))}
		class="btn-del {isFirst ? 'btn-inactive' : ''}"
		tabindex={isFirst ? -1 : 0}
		href="href">X</a
	>
	<select id="type-input" class="flex-obj" bind:value={inputType}>
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
	<input
		id="value-input"
		type={inputType}
		name="value[]"
		placeholder="value"
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
