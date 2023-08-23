import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { Prec } from "@codemirror/state";
import { editorTooltips, editorTaskTooltip } from "livePreview";
import { ReadingViewTasksBuilder } from "readingView"
import { buildTaskListPickers } from 'dataviewTaskList';
import type { ICheckBoxApi } from 'checkBoxApi';
import { CheckBoxApi } from 'checkBoxApi';

// Remember to rename these classes and interfaces!

interface TaskCompletionSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: TaskCompletionSettings = {
	mySetting: 'default'
}

export default class TaskCompletion extends Plugin {
	public api: ICheckBoxApi;
	settings: TaskCompletionSettings;
	dv: any

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new TaskCompletionSettingTab(this.app, this));


		this.registerMarkdownPostProcessor((el, ctx) => {
			(new ReadingViewTasksBuilder(this.app, el, ctx)).build();
		});

		this.registerEditorExtension(editorTooltips);
		this.registerEditorExtension(editorTaskTooltip);
		this.registerEvent(this.app.workspace.on("dataview:refresh-views", () => { console.log("view refresehd"); buildTaskListPickers() }))
		this.api = new CheckBoxApi(this).make();
		buildTaskListPickers();
		console.log("task-completion loaded");
	}


	onunload() {
		console.log("task-completion unloaded");
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class TaskCompletionSettingTab extends PluginSettingTab {
	plugin: TaskCompletion;

	constructor(app: App, plugin: TaskCompletion) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
