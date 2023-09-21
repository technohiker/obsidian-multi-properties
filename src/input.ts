export function createInput(
	options: Record<string, string>,
	isNew: boolean = false,
	label: string = ""
) {
	let inputDiv = createEl(
		"div",
		{
			cls: "modal-input-container",
		},
		(el) => {
			//Create Select box and populate with options.
			let selectEl = el.createEl("select", { value: "test" });
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
				attr: { name: "value[]", placeholder: "value" },
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
					console.log(document.activeElement);
					console.log(e.target);
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
