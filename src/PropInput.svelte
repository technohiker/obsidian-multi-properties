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
