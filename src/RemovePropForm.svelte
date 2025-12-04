<script lang="ts">
  interface Props {
    names?: string[];
    submission: (props: string[]) => void;
  }

  let { names = [], submission }: Props = $props();

  let errorEl: HTMLDivElement | null = $state(null);
  let alertText = $state(".");

  let checkCount = $state(0);

  let inputs: { name: string; isChecked: boolean }[] = $state([]);

  $effect(() => {
    const sortedNames = [...names].sort();
    inputs = sortedNames.map((name) => ({ name, isChecked: false }));
    checkCount = 0;
  });

  let isMaxChecked = $derived(inputs.length > 0 && checkCount >= inputs.length);

  function onCheckboxChange(event: any) {
    let checked = event.target.checked;
    checked ? checkCount++ : checkCount--;
  }

  function toggleAll() {
    const shouldCheckAll = !isMaxChecked;
    inputs = inputs.map((input) => ({ ...input, isChecked: shouldCheckAll }));
    checkCount = shouldCheckAll ? inputs.length : 0;
  }

  function onSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (checkCount === 0) {
      alertText = "Please select at least one property to remove.";
      errorEl?.classList.remove("hidden");
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
  <form onsubmit={onSubmit}>
    <div class="name-container">
      {#each inputs as input (input.name)}
        <label>
          <input
            type="checkbox"
            bind:checked={input.isChecked}
            onchange={(event) => onCheckboxChange(event)}
          />
          {input.name}
        </label>
      {/each}
    </div>
    <div class="button-container">
      <button type="submit">Confirm</button>
      <button type="button" onclick={toggleAll}
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
