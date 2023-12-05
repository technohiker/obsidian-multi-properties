<script lang="ts">
	export let names: string[] = ["test", "test2"];
	export let submission: () => void;
	export let close: () => void;
</script>

<div>
	<form on:submit|preventDefault={submission}>
		<p>The following properties will be removed:</p>
		<ul>
			{#each names as name}
				<li>
					{name}
				</li>
			{/each}
		</ul>
		<p>Are you sure you wish to remove these properties?</p>
		<button type="submit">Submit</button>
		<button on:click={close}>Cancel</button>
	</form>
</div>
