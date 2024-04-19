<script lang="ts">
  export let names: string[] = [];
  export let submission: (props: string[]) => void;

  let errorEl: HTMLDivElement;
  let alertText = ".";
  //let propNames: string[] = [];

  let checkCount = 0;
  $: isMaxChecked = checkCount >= names.length;
  $: console.log(isMaxChecked);

  let inputs: { name: string; isChecked: boolean }[] = [];
  for (let name of names) {
    inputs.push({ name, isChecked: false });
  }

  names.sort();

  // function handleCheckboxChange(event: any, string: string) {
  // 	const isChecked = event.target.checked;
  // 	if (isChecked) {
  // 		propNames = [...propNames, string];
  // 	} else {
  // 		propNames = propNames.filter((selected) => selected !== string);
  // 	}
  // }

  function onCheckboxChange(event: any) {
    let checked = event.target.checked;
    checked ? checkCount++ : checkCount--;
  }

  function toggleAll() {
    if (isMaxChecked) {
      inputs = inputs.map((input) => ({ ...input, isChecked: false }));
      checkCount = 0;
    } else {
      inputs = inputs.map((input) => ({ ...input, isChecked: true }));
      checkCount = names.length;
    }
  }

  function onSubmit() {
    if (checkCount === 0) {
      alertText = "Please select at least one property to remove.";
      errorEl.classList.remove("hidden");
      return;
    }
    let propNames = inputs
      .filter((input) => input.isChecked)
      .map((input) => input.name);
    submission(propNames);
  }
</script>

<div>
  <div id="alert-container" class="alert-container hidden" bind:this={errorEl}>
    <div>ERROR</div>
    <div id="alert-text">{alertText}</div>
  </div>
  <p>Select the properties you wish to remove from the file selection.</p>
  <form on:submit|preventDefault>
    <div class="name-container">
      {#each inputs as input}
        <label>
          <input
            type="checkbox"
            bind:value={input.name}
            bind:checked={input.isChecked}
            on:change={(event) => onCheckboxChange(event)}
          />
          {input.name}
        </label>
      {/each}
    </div>
    <div class="button-container">
      <button on:click={onSubmit} type="submit">Confirm</button>
      <button on:click={toggleAll}
        >{isMaxChecked ? "Uncheck All" : "Check All"}</button
      >
    </div>
  </form>
</div>

<style>
  .name-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-top: 10px;
    margin-bottom: 20px;
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

  .button-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .hidden {
    display: none;
  }
</style>
