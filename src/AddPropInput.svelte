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
    tags: "Text",
    cssclasses: "Text",
    aliases: "Text",
    text: "Text",
    multitext: "Text",
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
  function getSuggestions(str: string, defProps: Property[], max: number) {
    let arr = defProps;
    let suggestions: Array<Property> = [];

    while (arr && suggestions.length < max) {
      let result = arr.find((el) => el.name.includes(str));
      if (!result) return suggestions;

      suggestions.push(result);
      arr = arr.slice(arr.indexOf(result) + 1, arr.length);
    }
    return suggestions;
  }

  function inputChangeEvent(e: Event) {
    if (e instanceof InputEvent) return;
    let target = e.target;
    if (target instanceof HTMLInputElement) {
      let prop = suggestedProps.find((el) => el.name === target.value);
      if (prop === undefined) {
        console.log("Property not found.");
        return;
      }
      optionVal = options[convertProps[prop.widget]];
      changeType(optionVal);
    }
  }
</script>

<div class="modal-input-container">
  <datalist id="suggestion-list">
    {#each suggestedProps as prop}
      <option value={prop.name}></option>
    {/each}
  </datalist>
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
  <input
    list="suggestion-list"
    id="name-input"
    class="name-input flex-obj"
    type="text"
    name="name[]"
    placeholder="name"
    bind:this={inputEl}
    bind:value={nameVal}
    oninput={(e) => inputChangeEvent(e)}
    required
  />
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

  .modal-input-container {
    width: 95%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-top: 10px;
  }

  .btn-inactive {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.7;
  }
</style>
