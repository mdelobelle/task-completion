import { App, setIcon } from "obsidian";
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view";
import { RangeSetBuilder, Text } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { tokenClassNodeProp } from "@codemirror/language";
import * as Status from "statusTypes";
import tippy from "tippy.js";

import { tooltips, hoverTooltip } from "@codemirror/view"

export const editorTaskTooltip = hoverTooltip((view, pos, side) => {

    let { from, to, text } = view.state.doc.lineAt(pos)

    const taskRegex = new RegExp(/^(?<prefix>>?(\s+)?)- \[(?<status>.*)\](?<taskContent>.*)/)
    if (!taskRegex.test(text)) return null
    let start = pos, end = to
    while (start > from && taskRegex.test(text[start - from - 1])) start--

    if (start == pos && side < 0 || end == pos && side > 0)
        return null
    return {
        pos: from,
        end,
        above: false,
        create(view) {
            let dom = document.createElement("div")
            dom.addClass("suggestion-container")

            for (const status in Status.Status) {
                const btn = createDiv()
                btn.addClass("taskBtn")
                setIcon(btn, Status.statusIcon[status as keyof typeof Status.Status])
                btn.onclick = async (e) => {
                    //doesn't work for task in callout: 
                    //when clicked, the callout is rendered to preview in editorview and this view is destroyed
                    console.log("from liveView")
                    //@ts-ignore
                    const lineDOM = view.contentDOM.cmView.children.find(c => c.posAtStart === from)
                    const input = lineDOM.dom.querySelector("input")
                    const tR = text.match(taskRegex)
                    if (tR?.groups) {
                        const { prefix, taskContent } = tR.groups
                        if (input) {
                            input.setAttr('data-task', status);
                            (input as HTMLInputElement).checked = true;
                        }
                        view.dispatch({
                            changes: {
                                from: from,
                                to: to,
                                insert: `${prefix}- [${status}]${taskContent}`
                            }
                        })
                    }

                }
                dom.appendChild(btn)
            }

            return { dom, offset: { x: 0, y: 100 } }
        }
    }

}, {
    hoverTime: 10,
    hideOn: (tr, tooltip) => { return false }
})


export const editorTooltips = tooltips({ parent: document.body })