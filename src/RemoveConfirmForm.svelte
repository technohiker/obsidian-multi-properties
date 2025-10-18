<script lang="ts">
  import { onMount } from "svelte";

  export let names: string[] = ["test", "test2"];
  export let submission: () => void;
  export let cancel: () => void;

  let btnCancel: HTMLButtonElement;

  const word = names.length > 1 ? "properties" : "property";

  //Focus on cancel to make sure user does not easily submit changes.
  onMount(() => {
    btnCancel.focus();
  });
</script>

<div>
  <form on:submit|preventDefault={submission}>
    <p>The following {word} will be removed:</p>
    <ul>
      {#each names as name}
        <li>
          {name}
        </li>
      {/each}
    </ul>
    <p>Are you sure you wish to proceed?</p>
    <button class="mod-warning" type="submit">Delete</button>
    <button on:click={cancel} bind:this={btnCancel}>Cancel</button>
  </form>
</div>
