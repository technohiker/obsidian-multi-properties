<script lang="ts">
	import { onDestroy, onMount } from "svelte";

	export let isNew: boolean;
	export let removeInput: (id: number) => void;
	export let id: number;

	let inputType: string;
	let inputEl: HTMLInputElement;

	const options: Record<string, string> = {
		Text: "string",
		Number: "number",
		Checkbox: "checkbox",
		Date: "date",
		Datetime: "datetime-local",
	};

	onMount(() => {
		console.log({ isNew });
		console.log({ id });

		inputEl.focus();
	});

	onDestroy(() => {});
</script>

<div class="modal-input-container">
	<select bind:value={inputType}>
		{#each Object.keys(options) as key}
			<option value={options[key]}>{key}</option>
		{/each}
	</select>
	<input
		bind:this={inputEl}
		class="name-input"
		type="text"
		name="name[]"
		placeholder="name"
		required
	/>
	<input
		type={inputType}
		name="value[]"
		placeholder="value"
		class="value-input"
	/>
	{#if isNew}
		<a on:click={() => removeInput(id)} class="btn-del" href="href">X</a>
	{/if}
</div>
