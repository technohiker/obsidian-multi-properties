<script lang="ts">
  import { onMount, tick } from "svelte";
  import AddPropInput from "./AddPropInput.svelte";
  import type { NewPropData } from "./main";
  import { cleanTags, parseValue, removeExtraCommas } from "./helpers";
  import type { Property, PropertyTypes } from "./types/custom";
  import type { MultiPropSettings } from "./SettingTab";

  interface Props {
    submission: (props: Map<string, NewPropData>) => void;
    overwrite: boolean;
    alterProp: MultiPropSettings["alterProp"];
    delimiter: string;
    defaultProps: { name: string; value: any; type: PropertyTypes }[];
    changeBool: (bool: boolean) => void;
    changeSetting: (setting: MultiPropSettings["alterProp"]) => void;
    suggestedProps: Property[];
  }

  let {
    submission,
    overwrite = $bindable(),
    alterProp = $bindable(),
    delimiter,
    defaultProps,
    changeBool,
    changeSetting,
    suggestedProps,
  }: Props = $props();

  let countInputs = 0; //Could replace with UUID.
  let formEl: HTMLFormElement = $state(document.createElement("form"));
  let errorEl: HTMLDivElement = $state(document.createElement("div"));
  let alertText = $state(".");

  let inputEls: {
    id: number;
    totalInputs: number;
    typeDef: PropertyTypes;
    nameDef: string;
    valueDef: any;
  }[] = $state([]);

  function onCheckboxChange() {
    overwrite = !overwrite;
    changeBool(overwrite);
  }

  function onDropdownChange(newSetting: any) {
    changeSetting(newSetting);
  }

  onMount(() => {
    defaultProps.length > 0
      ? addInputs(defaultProps)
      : addInputs([{ type: "text", name: "", value: "" }]);
  });

  /** Add new input to inputEls */
  function addInputs(
    inputs: { type: PropertyTypes; name: string; value: any }[] = [
      { type: "text", name: "", value: "" },
    ]
  ) {
    let arr = [];
    for (let input of inputs) {
      countInputs++;
      arr.push({
        id: countInputs,
        totalInputs: countInputs,
        typeDef: input.type,
        nameDef: input.name,
        valueDef: input.value,
      });
    }
    inputEls = [...inputEls, ...arr];
  }

  /** Remove input from inputEls */
  async function removeInput(id: number) {
    inputEls = inputEls.filter((input) => input.id !== id);
    await tick();

    //Set focus to previous input.
    let inputs: NodeListOf<HTMLInputElement> = formEl.querySelectorAll("input");
    if (!inputs) return;

    inputs[inputs.length - 2].focus();
  }

  function addSuggested(prop: Property) {
    if (!inputEls.find((el) => el.nameDef === prop.name)) {
      addInputs([{ type: prop.widget, name: prop.name, value: "" }]);
    }
  }

  /** See if there are duplicate property names.*/
  function checkDuplicateNames() {
    let set = new Set();
    for (let input of inputEls) set.add(input.nameDef);

    if (set.size < inputEls.length) return true;
    else return false;
  }

  /** Display an error message. */
  function runError(errorText: string) {
    alertText = errorText;
    errorEl.classList.remove("hidden"); //Should I have this error message fade away?
  }

  /** Search for all labels and values, add them to a map, then pass them back to modal.*/
  function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    //Make sure there are no duplicate names.
    if (checkDuplicateNames()) {
      runError("Duplicate property names are not allowed.");
      return;
    }

    let obj: Map<string, NewPropData> = new Map();

    let inputs: NodeListOf<HTMLInputElement> = formEl.querySelectorAll(
      'input[name^="name[]"]'
    );

    inputs.forEach((input) => {
      //Check for proper inputs being next to each other.
      if (!(input.nextElementSibling instanceof HTMLInputElement)) return;
      if (!(input.previousElementSibling instanceof HTMLSelectElement)) return;
      if (
        !(input.previousElementSibling.children[0] instanceof HTMLOptionElement)
      )
        return;
      //TODO: Implement error handling if inputs are inaccurate?
      //The entire form is dependent on this structure, though.

      //Get name, value and type from inputs.
      let name = input.value;
      if (name === "") {
        input.reportValidity();
        return;
      }

      const selectEl = input.previousElementSibling as HTMLSelectElement;
      const htmlType = selectEl.value;

      const reverseOptions: Record<string, PropertyTypes> = {
        string: "text",
        number: "number",
        checkbox: "checkbox",
        date: "date",
        "datetime-local": "datetime",
      };
      const obsidianType = reverseOptions[htmlType] ?? "text";

      let value: any = parseValue(
        input.nextElementSibling,
        input.nextElementSibling.type
      );
      //Check for tags.  Clean them of any invalid characters, then split by comma.
      if (typeof value === "string") {
        if (name === "tags") {
          value = cleanTags(value);
        }
        if (typeof value === "string" && value.includes(",")) {
          let str = removeExtraCommas(value);
          value = str.split(delimiter);
        }
      }
      if (value === "") value = null;

      //Store data into object.
      let propObj: NewPropData = {
        type: obsidianType,
        data: value,
        overwrite: false,
        delimiter: delimiter,
      };

      obj.set(name, propObj);
    });

    //TODO: Error handling for when user submits with an empty name.
    //Input validation doesn't trigger unless this code is in.  Why?  I didn't need this before.
    if (obj.size < inputs.length) return;

    submission(obj);
  }
</script>

<div id="multi-properties-modal" class="modal-content">
  <div id="alert-container" class="alert-container hidden" bind:this={errorEl}>
    <div>ERROR</div>
    <div id="alert-text">{alertText}</div>
  </div>

  <p>Select from existing properties or create new ones:</p>
  <div class="suggested-props">
    {#each suggestedProps as prop}
      <button
        type="button"
        class="prop-chip"
        onclick={() => addSuggested(prop)}
      >
        {prop.name}
      </button>
    {/each}
  </div>

  <p>
    Type in a property name, then value. Use the dropbox to choose what type of
    data you wish to store.
  </p>
  <p>
    If you want to make a List property, use the Text data type and separate
    each value with a "{delimiter}".
  </p>
  <p>If you want to add Tags, use the name "tags".</p>
  <form onsubmit={onSubmit} bind:this={formEl}>
    <label>
      {"How to alter props that already exist on notes."}
      <select
        bind:value={alterProp}
        onchange={() => onDropdownChange(alterProp)}
      >
        <option value="ignore">Ignore the prop entirely.</option>
        <option value="overwrite">Overwrite new value over prop.</option>
        <option value="append">Append new value to prop.</option>
      </select>
    </label>
    <div class="modal-inputs-container">
      {#each inputEls as input (input.id)}
        <AddPropInput
          id={input.id}
          totalInputs={inputEls.length}
          bind:typeVal={input.typeDef}
          bind:nameVal={input.nameDef}
          bind:valueVal={input.valueDef}
          {removeInput}
        />
      {/each}
    </div>
    <div class="modal-add-container">
      <button
        type="button"
        onclick={() => addInputs([{ type: "text", name: "", value: "" }])}
        class="a-btn">Add</button
      >
    </div>
    <div class="modal-button-container">
      <button type="submit" class="btn-submit">Submit</button>
    </div>
  </form>
</div>

<style>
  .modal-inputs-container {
    height: 200px;
    width: 100%;
    overflow-y: scroll;
    border-radius: 5px;
    border-style: solid;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .modal-add-container {
    margin-top: 10px;
  }
  .alert-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    background-color: red;
    font-weight: bold;
  }
  .suggested-props {
    overflow-y: scroll;
    max-height: 100px;
  }
  .hidden {
    display: none;
  }
</style>
