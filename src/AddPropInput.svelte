<script lang="ts">
  import { onMount, tick } from "svelte";

  export let isFirst: boolean;
  export let removeInput: (id: number) => void;
  export let id: number;

  export let typeVal: string = "text";
  export let nameVal: string = "";
  export let valueVal: string = "";

  let inputEl: HTMLInputElement;
  let valueEl: HTMLInputElement;

  let optionVal: string;
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
  });

  function changeType(type: string) {
    valueEl.type = type;
  }
</script>

<div class="modal-input-container">
  <button
    type="button"
    id="del-btn"
    on:click={() => {
      if (!isFirst) {
        removeInput(id);
      }
    }}
    class="btn-del {isFirst ? 'btn-inactive' : ''}"
    tabindex={isFirst ? -1 : 0}>X</button
  >
  <select
    id="type-input"
    class="flex-obj"
    bind:value={optionVal}
    on:change={() => changeType(optionVal)}
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
    align-items: center;
    gap: 10px;
    margin-top: 10px;
  }

  .btn-inactive {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.7;
  }
</style>
