<script lang="ts">
  import { onMount, tick } from "svelte";

  interface Props {
    isFirst: boolean;
    removeInput: (id: number) => void;
    id: number;
    typeVal?: string;
    nameVal?: string;
    valueVal?: string;
  }

  let {
    totalInputs = $bindable(0),
    removeInput,
    id,
    typeVal = $bindable("text"),
    nameVal = $bindable(""),
    valueVal = $bindable(""),
  }: Props = $props();

  let inputEl: HTMLInputElement = $state(document.createElement("input"));
  let valueEl: HTMLInputElement = $state(document.createElement("input"));

  let optionVal: string = $state("");
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
  input {
    max-height: 25px;
    overflow-x: auto;
  }

  select {
    height: 21px;
  }
  select {
    height: 21px;
  }

  #name-input {
    flex-grow: 0;
    width: auto;
  }
  #name-input {
    flex-grow: 0;
    width: auto;
  }

  .modal-input-container {
    width: 95%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
  }
  .modal-input-container {
    width: 95%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
  }

  .btn-inactive {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.7;
  }
  .btn-inactive {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.7;
  }
</style>
