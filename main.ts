import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

interface LatexKatexPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: LatexKatexPluginSettings = {
	mySetting: "default",
};

export default class LatexKatexPlugin extends Plugin {
	settings: LatexKatexPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Run KaTeX to LaTeX Conversion",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				this.convertKatexToLatex();
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");
	}

	convertKatexToLatex() {
		new Notice("Starting KaTeX to LaTeX conversion...");

		try {
			// Get the content from clipboard (assuming it contains KaTeX)
			navigator.clipboard
				.readText()
				.then((katexInput) => {
					// Replace KaTeX inline math delimiters \( \) with LaTeX inline math delimiters $
					let latexOutput = katexInput.replace(
						/\\\(\s*(.*?)\s*\\\)/g,
						"$1"
					);
					// Replace KaTeX block math delimiters \[ \] with LaTeX block math delimiters $$
					latexOutput = latexOutput.replace(
						/\\\[\s*(.*?)\s*\\\]/g,
						"$$$1$$"
					);

					// Copy the LaTeX output back to clipboard
					navigator.clipboard
						.writeText(latexOutput)
						.then(() => {
							new Notice(
								"KaTeX to LaTeX conversion completed successfully! The LaTeX output has been copied to the clipboard."
							);
						})
						.catch((err) => {
							new Notice(`Failed to copy to clipboard: ${err}`);
						});
				})
				.catch((err) => {
					new Notice(`Failed to read from clipboard: ${err}`);
				});
		} catch (error) {
			new Notice(`Error during conversion: ${error.message}`);
		}
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
