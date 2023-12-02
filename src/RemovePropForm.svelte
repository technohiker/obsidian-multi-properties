<script lang="ts">
	export let submission: (props: string[]) => void;

	function onSubmit() {
		submission([]);
	}
</script>

<div>
	<p>Select the properties you wish to remove from the file selection.</p>
	<form on:submit|preventDefault></form>
</div>
