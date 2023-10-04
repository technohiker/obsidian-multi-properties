<script lang="ts">
	export const isNew = false;

	let inputType: string;

	const options: Record<string, string> = {
		Text: "string",
		Number: "number",
		Checkbox: "checkbox",
		Date: "date",
		Datetime: "datetime-local",
	};

	function removeInput() {
		//Set focus to previous input before deleting.
		//Remove this input.
	}
</script>

<div class="modal-input-container">
	<select bind:value={inputType}>
		{#each Object.keys(options) as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
	<input
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
		<a on:click={removeInput} class="btn-del" href="href">X</a>
	{/if}
</div>
