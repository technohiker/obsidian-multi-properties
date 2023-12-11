<script lang="ts">
	import { onMount } from "svelte";
	import { NewPropData } from "./main";

	export let props: Map<string, NewPropData>;
	export let overwrite: boolean = true;
	export let submission: () => void;
	export let cancel: () => void;

	let btnCancel: HTMLButtonElement;

	const msg = overwrite
		? "Any pre-existing text props will have their values overwritten."
		: "Any pre-existing text props will have their values be appended to.";

	//Focus on cancel to make sure user does not easily submit changes.
	onMount(() => {
		btnCancel.focus();
	});
</script>

<div>
	<form on:submit|preventDefault={submission}>
		<p class="msg">{msg}</p>
		<p>The following props will be added:</p>
		<ul>
			{#each [...props] as [propName, prop]}
				<li>
					{propName}: {prop.data}
				</li>
			{/each}
		</ul>
		<p>Are you sure you wish to proceed?</p>
		<button class="mod-warning" type="submit">Confirm</button>
		<button on:click={cancel} bind:this={btnCancel}>Cancel</button>
	</form>
</div>

<style>
	.msg {
		font-weight: bold;
		padding-bottom: 10px;
	}
</style>
