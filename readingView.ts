import { App, MarkdownPostProcessorContext, TFile } from "obsidian";
import { StatusPicker } from "statusPicker";

export class ReadingViewTasksBuilder {
    constructor(
        public app: App,
        public el: HTMLElement,
        public ctx: MarkdownPostProcessorContext
    ) { }

    build() {
        const tasksNodes = this.el.querySelectorAll("li.task-list-item")

        tasksNodes.forEach((taskNode, i) => {
            const onSelect = async (value: string) => {
                console.log("from reading view")
                await this.replaceTaskNode(taskNode, value)
                const input = taskNode.querySelector("input")
                if (input) {
                    if (value === " ") {
                        input.checked = false;
                        taskNode.removeClass("is-checked")
                    } else {
                        input.checked = true;
                        taskNode.addClass("is-checked")
                    }
                    taskNode.setAttr("data-task", value);
                }
            }
            const statusPicker = new StatusPicker(taskNode, onSelect);
            statusPicker.build()
        })
    }

    async replaceTaskNode(taskNode: Element, newValue: string) {

        const container = this.el.closest(".cm-contentContainer") || this.el.closest(".markdown-reading-view")
        const allTasks = container?.querySelectorAll("li.task-list-item") || []
        const taskRank = Array.prototype.slice.call(allTasks).indexOf(taskNode)
        console.log(container, taskNode, allTasks)
        const file = this.app.vault.getAbstractFileByPath(this.ctx.sourcePath)
        if (file && file instanceof TFile) {
            const content = await app.vault.read(file)
            const newContent: string[] = []
            let currentTask: number | null = null;
            const taskRegex = new RegExp(/^(?<prefix>>?(\s+)?)- \[(?<status>.*)\](?<taskContent>.*)/)
            content.split("\n").forEach((line, i) => {
                if (line.match(taskRegex)) {
                    currentTask = currentTask === null ? 0 : currentTask + 1
                    const groups = line.match(taskRegex)?.groups
                    if (currentTask === taskRank && groups) {
                        newContent.push(`${groups.prefix}- [${newValue}]${groups.taskContent}`)
                    } else {
                        newContent.push(line)
                    }
                } else {
                    newContent.push(line)
                }
            })
            app.vault.modify(file, newContent.join("\n"))
        }
    }
}