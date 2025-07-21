<script lang="ts">
  import { onMount, tick } from "svelte";
  import PropInput from "./AddPropInput.svelte";
  import { NewPropData } from "./main";
  import { cleanTags, parseValue, removeExtraCommas } from "./helpers";
  import type { PropertyTypes } from "./types/custom";

  export let submission: (props: Map<string, any>) => void;
  export let overwrite: boolean;
  export let delimiter: string = ",";
  export let defaultProps: { name: string; value: any; type: PropertyTypes }[] =
    [];
  export let changeBool: (bool: boolean) => void;

  let countInputs = 0; //Could replace with UUID.
  let formEl: HTMLFormElement;
  let errorEl: HTMLDivElement;
  let alertText = ".";

  let inputEls: {
    id: number;
    isFirst: boolean;
    typeDef: PropertyTypes;
    nameDef: string;
    valueDef: any;
  }[] = [];

  function onCheckboxChange() {
    overwrite = !overwrite;
    changeBool(overwrite);
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
        isFirst: countInputs === 1 ? true : false,
        typeDef: input.type,
        nameDef: input.name,
        valueDef: input.value,
      });
    }
    console.log(inputEls);
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
  function onSubmit() {
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

      let value: any = parseValue(
        input.nextElementSibling,
        input.nextElementSibling.type
      );
      //Check for tags.  Clean them of any invalid characters, then split by comma.
      if (typeof value === "string") {
        if (name === "tags") {
          value = cleanTags(value);
        }
        if (value.contains(delimiter)) {
          let str = removeExtraCommas(value);
          value = str.split(delimiter);
        }
      }
      if (value === "") value = null;

      let inputType: string =
        input.previousElementSibling.children[0].innerText.toLowerCase();

      //Store data into object.
      let propObj: NewPropData = {
        type: inputType,
        data: value,
        overwrite: false,
        delimiter: delimiter,
      };

      obj.set(name, propObj);
    });

    //TODO: Error handling for when user submits with an empty name.
    //Input validation doesn't trigger unless this code is in.  Why?  I didn't need this before.
    if (obj.size < inputs.length) return;

    console.log(obj);

    submission(obj);
  }
</script>

<div id="multi-properties-modal" class="modal-content">
  <div id="alert-container" class="alert-container hidden" bind:this={errorEl}>
    <div>ERROR</div>
    <div id="alert-text">{alertText}</div>
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
  <form on:submit|preventDefault bind:this={formEl}>
    <label
      ><input
        type="checkbox"
        checked={overwrite}
        on:change={onCheckboxChange}
      />{"Overwrite existing properties"}</label
    >
    <div class="modal-inputs-container">
      {#each inputEls as input (input.id)}
        <PropInput
          isFirst={input.isFirst}
          id={input.id}
          bind:typeVal={input.typeDef}
          bind:nameVal={input.nameDef}
          bind:valueVal={input.valueDef}
          {removeInput}
        />
      {/each}
    </div>
    <div class="modal-add-container">
      <a
        on:click={() => addInputs([{ type: "text", name: "", value: "" }])}
        class="a-btn"
        href="href">Add</a
      >
    </div>
    <div class="modal-button-container">
      <button on:click={onSubmit} class="btn-submit">Submit</button>
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
  .hidden {
    display: none;
  }
</style>
