<script lang="ts">
  import { onMount, tick } from "svelte";
  import type { Property } from "./types/custom";

  interface Props {
    totalInputs: number;
    removeInput: (id: number) => void;
    id: number;
    suggestedProps: Property[];
    typeVal?: string;
    nameVal?: string;
    valueVal?: string;
  }

  let {
    totalInputs = $bindable(0),
    removeInput,
    id,
    suggestedProps,
    typeVal = $bindable("text"),
    nameVal = $bindable(""),
    valueVal = $bindable(""),
  }: Props = $props();

  let inputEl: HTMLInputElement = $state(document.createElement("input"));
  let valueEl: HTMLInputElement = $state(document.createElement("input"));
  let listEl: HTMLDivElement = $state(document.createElement("div"));
  let suggestedList: Property[] = [];

  //Form names tied to input types.
  const options: Record<string, string> = {
    Text: "string",
    Number: "number",
    Checkbox: "checkbox",
    Date: "date",
    Datetime: "datetime-local",
  };
  //Match Obsidian data types to form names.
  const convertProps: Record<string, string> = {
    text: "Text",
    multitext: "Text",
    tags: "Text",
    aliases: "Text",
    number: "Number",
    checkbox: "Checkbox",
    date: "Date",
    datetime: "Datetime",
  };

  // Initialize here instead of in onMount so <select has a value when the test checks it.
  let optionVal: string = $state(options[convertProps[typeVal]]);

  onMount(async () => {
    await tick(); //Focus won't work right without tick().
    inputEl.focus();
    inputEl.select();
    optionVal = options[convertProps[typeVal]]; //Load default type.
    if (typeVal !== "text") changeType(optionVal);
  });

  function changeType(type: string) {
    valueEl.type = type;
  }

  function addSuggested(prop: Property) {
    console.log("Fired!");
    nameVal = prop.name;
    optionVal = options[convertProps[prop.widget]];
    changeType(optionVal);
  }

  function matchProp(str: string) {
    suggestedProps.find((el) => str === el.name.substring(0, str.length - 1));
  }
</script>

<div class="modal-input-container">
  <a
    id="del-btn"
    onclick={() => {
      // Only disable removal if there is exactly 1 input
      if (totalInputs <= 1) return;
      removeInput(id);
    }}
    class="btn-del {totalInputs <= 1 ? 'btn-inactive' : ''}"
    tabindex={totalInputs <= 1 ? -1 : 0}
    href="href">X</a
  >
  <select
    id="type-input"
    class="flex-obj"
    bind:value={optionVal}
    onchange={() => changeType(optionVal)}
  >
    {#each Object.keys(options) as key}
      <option value={options[key]}>{key}</option>
    {/each}
  </select>
  <div class="flex-input">
    <div id="name-input-container">
      <input
        id="name-input"
        bind:this={inputEl}
        class="name-input flex-obj"
        type="text"
        name="name[]"
        placeholder="name"
        bind:value={nameVal}
        required
      />
      <div class="suggestion-list" bind:this={listEl}>
        {#each suggestedProps as prop}
          <a href="href" onclick={() => addSuggested(prop)}>{prop.name}</a>
        {/each}
        <a
          href="href"
          onclick={() =>
            addSuggested({ name: "tags", widget: "text", occurrences: 1 })}
          >AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</a
        >
        <a
          href="Href"
          onclick={() =>
            addSuggested({ name: "rank", widget: "number", occurrences: 1 })}
          >Rank</a
        >
      </div>
    </div>
  </div>
  <input
    bind:this={valueEl}
    id="value-input"
    type="text"
    name="value[]"
    placeholder="value"
    bind:value={valueVal}
    class="value-input flex-obj"
  />
</div>

<style>
  input {
    max-height: 25px;
    overflow-x: auto;
  }

  select {
    height: 21px;
  }

  #name-input {
    flex-grow: 0;
    width: auto;
  }
  #name-input-container {
    position: relative;
  }

  .modal-input-container {
    width: 95%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-top: 10px;
  }

  .suggestion-list {
    width: 100%;
    overflow-x: clip;
    display: flex;
    flex-direction: column;
    position: absolute;
    margin-top: 0px;
    margin-bottom: 0px;
    padding-left: 0px;
  }

  .btn-inactive {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.7;
  }
</style>
