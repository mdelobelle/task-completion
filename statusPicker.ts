import { setIcon } from "obsidian";
import * as Status from "statusTypes";
import tippy from "tippy.js";

export class StatusPicker {

    constructor(
        public taskNode: Element,
        public onSelect: (value: string) => {}
    ) {

    }

    build() {

        const taskNode = this.taskNode
        const input = taskNode.querySelector("input")
        const wrapper = createSpan({ cls: "checkboxStatusWrapper" })
        const btnContainer = createDiv({ cls: "btn-container" })


        for (const status in Status.Status) {
            const btn = createDiv()
            btn.addClass("taskBtn")
            setIcon(btn, Status.statusIcon[status as keyof typeof Status.Status])
            btn.onclick = async (e) => {
                this.onSelect(status)
                e.stopPropagation();
            }
            btnContainer.appendChild(btn)
        }

        if (input) {
            input?.parentElement?.insertBefore(wrapper, input)
            const instance = tippy(input, {
                content: btnContainer,
                theme: 'light',
                appendTo: wrapper,
                interactive: true,
                arrow: false,
                placement: 'top'
            })
        }
    }
}