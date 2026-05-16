<script lang="ts">
  import { onMount } from "svelte";
  import type { NewPropData } from "./main";
  import type { MultiPropSettings } from "./SettingTab";
  import type en from "./i18n/en";

  interface Props {
    newProps: Map<string, NewPropData>;
    alterProp: MultiPropSettings["alterProp"];
    submission: () => void;
    cancel: () => void;
    t: typeof en;
  }

  let { newProps, alterProp, submission, cancel, t }: Props = $props();

  let btnCancel: HTMLButtonElement | null = $state(null);

  let msg = $derived(createPropMsg(alterProp));

  function createPropMsg(value: MultiPropSettings["alterProp"]) {
    switch (value) {
      case "ignore":
        return t.ignoreMsg;
      case "append":
        return t.appendMsg;
      case "overwrite":
        return t.overwriteMsg;
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
    <p>{t.followingPropsWillBeAdded}</p>
    <ul>
      {#each [...newProps] as [propName, prop]}
        <li>
          {propName}: {prop.data}
        </li>
      {/each}
    </ul>
    <p>{t.areYouSure}</p>
    <button class="mod-warning" type="submit">{t.confirmButton}</button>
    <button type="button" onclick={cancel} bind:this={btnCancel}>{t.cancelButton}</button>
  </form>
</div>

<style>
  .msg {
    font-weight: bold;
    padding-bottom: 10px;
  }
</style>
