<script lang="ts">
	export let names: string[] = [];
	export let submission: (props: string[]) => void;

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
		submission(propNames);
	}
</script>

<div>
	<p>Select the properties you wish to remove from the file selection.</p>
	<form on:submit|preventDefault={onSubmit}>
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
	</form>
</div>
