<script lang="ts">
	import { onDestroy, onMount, tick } from "svelte";

	export let isNew: boolean;
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

	onMount(async () => {
		await tick();
		inputEl.focus();
		inputEl.select();
	});
</script>

<div class="modal-input-container">
	{#if isNew}
		<a on:click={() => removeInput(id)} class="btn-del" href="href">X</a>
	{/if}
	<select class="flex-obj" bind:value={inputType}>
		{#each Object.keys(options) as key}
			<option value={options[key]}>{key}</option>
		{/each}
	</select>
	<input
		bind:this={inputEl}
		class="name-input flex-obj"
		type="text"
		name="name[]"
		placeholder="name"
		bind:value={nameVal}
		required
	/>
	<input
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

	.modal-input-container {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		gap: 10px;
		margin-top: 10px;
	}

	select {
		height: 21px;
	}
</style>
