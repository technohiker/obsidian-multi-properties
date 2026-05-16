<script lang="ts">
  import { onMount } from "svelte";
  import type en from "./i18n/en";
  import { format } from "./i18n";

  interface Props {
    names?: string[];
    submission: () => void;
    cancel: () => void;
    t: typeof en;
  }

  let { names = ["test", "test2"], submission, cancel, t }: Props = $props();

  let btnCancel: HTMLButtonElement | null = $state(null);

  let word = $derived(names.length > 1 ? t.properties : t.property);

  function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    submission();
  }

  //Focus on cancel to make sure user does not easily submit changes.
  onMount(() => {
    btnCancel?.focus();
  });
</script>

<div>
  <form onsubmit={onSubmit}>
    <p>{format(t.followingPropertiesWillBeRemoved, { word })}</p>
    <ul>
      {#each names as name}
        <li>
          {name}
        </li>
      {/each}
    </ul>
    <p>{t.areYouSure}</p>
    <button class="mod-warning" type="submit">{t.deleteButton}</button>
    <button type="button" onclick={cancel} bind:this={btnCancel}>{t.cancelButton}</button>
  </form>
</div>
