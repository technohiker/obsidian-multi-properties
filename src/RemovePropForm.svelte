<script lang="ts">
	export let names: string[] = [];
	export let submission: (props: string[]) => void;

	names.sort();

	console.log("Form Names: ", names);

	let propNames: string[] = [];

	function handleCheckboxChange(event: any, string: string) {
		const isChecked = event.target.checked;
		if (isChecked) {
			propNames = [...propNames, string];
		} else {
			propNames = propNames.filter((selected) => selected !== string);
		}
	}

	function onSubmit() {
		console.log({ propNames });
		if (propNames.length === 0) {
			alert("Please select at least one property to remove.");
		}
		submission(propNames);
	}
</script>

<div>
	<p>Select the properties you wish to remove from the file selection.</p>
	<form on:submit|preventDefault={onSubmit}>
		<div class="name-container">
			{#each names as name}
				<label>
					<input
						type="checkbox"
						value={name}
						on:change={(event) => handleCheckboxChange(event, name)}
					/>
					{name}
				</label>
			{/each}
		</div>
		<button type="submit">Confirm</button>
	</form>
</div>

<style>
	.name-container {
		display: flex;
		flex-direction: column;
		gap: 5px;
		margin-top: 10px;
		margin-bottom: 20px;
	}
</style>