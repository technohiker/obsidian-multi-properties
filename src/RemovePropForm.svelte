<script lang="ts">
	export let names: string[] = [];
	export let submission: (props: string[]) => void;
	let errorEl: HTMLDivElement;
	let alertText = ".";
	let propNames: string[] = [];

	names.sort();

	function handleCheckboxChange(event: any, string: string) {
		const isChecked = event.target.checked;
		if (isChecked) {
			propNames = [...propNames, string];
		} else {
			propNames = propNames.filter((selected) => selected !== string);
		}
	}

	function onSubmit() {
		if (propNames.length === 0) {
			alertText = "Please select at least one property to remove.";
			errorEl.classList.remove("hidden");
			return;
		}
		submission(propNames);
	}
</script>

<div>
	<div id="alert-container" class="alert-container hidden" bind:this={errorEl}>
		<div>ERROR</div>
		<div id="alert-text">{alertText}</div>
	</div>
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
	.alert-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 10px;
		background-color: red;
		font-weight: bold;
	}
	.hidden {
		display: none;
	}
</style>
