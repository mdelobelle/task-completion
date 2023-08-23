import { TFile } from "obsidian"
import CheckBox from "main"

export interface ICheckBoxApi {
    checkBoxModifier: (task: any) => any;
}

export class CheckBoxApi {

    constructor(private plugin: CheckBox) { }

    public make(): ICheckBoxApi {
        return {
            checkBoxModifier: this.checkBoxModifier(),
        };
    }

    private checkBoxModifier(): (task: any) => any {
        return (task: any) => { return task }
    }

}