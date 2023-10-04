<script lang="ts">
	import PropInput from "./PropInput.svelte";

	export let closeModal: () => void;
	export let submission: () => void;

	function addInput() {
		//Create new input object.
		//Append to modal-inputs-container
		//Set tab index to newDiv's first input.
	}

	function onSubmit() {
		submission();
	}
</script>

<div class="modal">
	<div class="modal-close-button">::before</div>
	<div class="modal-title">
		<h2>Add Properties</h2>
	</div>
	<div class="modal-content">
		<p>
			Type in a property name, then value. Use the dropbox to choose what type
			of data you wish to store.
		</p>
		<p>
			If you want to make a List property, use the same name for each entry to
			the list.
		</p>
		<p>If you want to add Tags, use the name "tags".</p>
		<form>
			<div class="modal-inputs-container" />
			<div class="modal-add-container">
				<a on:click={addInput} class="a-btn" href="href">Add</a>
			</div>
			<div class="modal-button-container">
				<button class="btn-submit">Submit</button>
				<button on:click={closeModal} class="btn-cancel">Cancel</button>
			</div>
		</form>
	</div>
</div>
