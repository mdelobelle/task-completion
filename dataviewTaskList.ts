import { TFile } from "obsidian"
import { StatusPicker } from "statusPicker"


function replaceTaskStatus(file: TFile, line: number, newStatus: string) {

}

export function buildTaskListPickers() {
    console.log("building")

    const tasksNodes = document.querySelectorAll("li.dataview.task-list-item")
    console.log(tasksNodes)

    tasksNodes.forEach((taskNode, i) => {
        taskNode.querySelector("span.checkboxStatusWrapper")?.remove()
        const onSelect = async (value: string) => {
            console.log("from dataview")
            console.log(taskNode)
        }
        const statusPicker = new StatusPicker(taskNode, onSelect);
        statusPicker.build()
    })
}