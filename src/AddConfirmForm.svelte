<script lang="ts">
  import { onMount } from "svelte";
  import type { NewPropData } from "./main";
  import type { MultiPropSettings } from "./SettingTab";

  interface Props {
    newProps: Map<string, NewPropData>;
    overwrite?: boolean;
    alterProp: MultiPropSettings["alterProp"];
    submission: () => void;
    cancel: () => void;
  }

  let {
    newProps,
    overwrite = true,
    alterProp = "ignore",
    submission,
    cancel,
  }: Props = $props();

  let btnCancel: HTMLButtonElement | null = $state(null);

  let msg = $derived(createPropMsg(alterProp));

  function createPropMsg(value: MultiPropSettings["alterProp"]) {
    switch (value) {
      case "ignore":
        return "Any of these text props on existing notes will not be affected.";
      case "append":
        return "NOTE: Any pre-existing text props will have their values be appended to.";
      case "overwrite":
        return "WARNING: Any pre-existing text props will have their values overwritten.";
    }
  }

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
    <p class="msg">{msg}</p>
    <p>The following props will be added:</p>
    <ul>
      {#each [...newProps] as [propName, prop]}
        <li>
          {propName}: {prop.data}
        </li>
      {/each}
    </ul>
    <p>Are you sure you wish to proceed?</p>
    <button class="mod-warning" type="submit">Confirm</button>
    <button type="button" onclick={cancel} bind:this={btnCancel}>Cancel</button>
  </form>
</div>

<style>
  .msg {
    font-weight: bold;
    padding-bottom: 10px;
  }
</style>
