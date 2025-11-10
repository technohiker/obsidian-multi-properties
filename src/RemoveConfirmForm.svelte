<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    names?: string[];
    submission: () => void;
    cancel: () => void;
  }

  let { names = ["test", "test2"], submission, cancel }: Props = $props();

  let btnCancel: HTMLButtonElement = $state(document.createElement("button"));

  const word = names.length > 1 ? "properties" : "property";

  function onSubmit(e: SubmitEvent) {
    console.log("Submit");
    e.preventDefault();
    submission();
  }

  //Focus on cancel to make sure user does not easily submit changes.
  onMount(() => {
    btnCancel.focus();
  });
</script>

<div>
  <form onsubmit={onSubmit}>
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
    <button type="button" onclick={cancel} bind:this={btnCancel}>Cancel</button>
  </form>
</div>
