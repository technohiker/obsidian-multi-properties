export function createInput(
	options: Record<string, string>,
	isNew: boolean = false,
	option: string = "checkbox",
	label: string = ""
) {
	let inputDiv = createEl(
		"div",
		{
			cls: "modal-input-container",
		},
		(el) => {
			//Create Select box and populate with options.  Set default if available.
			//let selectEl = el.createEl("select", { value: "test" });
			let selectEl = el.createEl("select", { value: option });
			for (let key of Object.keys(options)) {
				selectEl.createEl("option", { value: options[key], text: key });
			}

			//Property name.
			let labelEl = el.createEl("input", {
				type: "string",
				attr: { name: "name[]", required: true, placeholder: "name" },
				text: label,
				cls: "name-input",
			}); //Should have different style.
			//Property value.
			let inputEl = el.createEl("input", {
				type: selectEl.value,
				attr: {
					name: "value[]",
					placeholder: "value",
				},
				cls: "value-input",
			});
			//If this is a new input, add a deletion button.
			if (isNew) {
				let deleteButton = el.createEl("a", {
					text: "X",
					cls: "btn-del",
					href: "href",
				});
				deleteButton.addEventListener("click", (e: Event) => {
					e.preventDefault();

					//Set focus on previous input before deleting.
					let inputs = el.parentElement?.querySelectorAll("input");
					if (!inputs) return; //Should have better error handling here.  TODO
					inputs[inputs.length - 4].focus();

					el.remove();
				});
			}

			//Add event listener that changes input type based on select value.
			selectEl.addEventListener("change", (e: Event) => {
				e.preventDefault();
				console.log("Fired!");
				inputEl.type = selectEl.value;
			});
		}
	);
	return inputDiv;
}
// }
// export let inputDiv = createEl("div", {
//   cls: "input-div",
// }, (el) => {
//   let selectEl = el.createEl("select", { value: "test" });
//   for (let key of Object.keys(this.options)) {
//     selectEl.createEl("option", { value: this.options[key], text: key });
//   }

//   //Property name.
//   let labelEl = el.createEl("input", {
//     type: "string",
//     attr: { name: "name[]" },
//   }); //Should have different style.
//   //Property value.
//   let inputEl = el.createEl("input", {
//     type: selectEl.value,
//     attr: { name: "value[]" },
//   });
