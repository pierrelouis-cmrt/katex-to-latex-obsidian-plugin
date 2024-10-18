import { App, Editor, MarkdownView, Notice, Plugin } from "obsidian";

export default class LatexKatexPlugin extends Plugin {
	async onload() {
		// Add a command to convert selected text from KaTeX to LaTeX via Obsidian command palette
		this.addCommand({
			id: "convert-katex-to-latex",
			name: "Convert selected KaTeX to LaTeX",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const selection = editor.getSelection();
				if (selection.trim() === "") {
					new Notice("No text selected for conversion.");
					return;
				}

				// Replace KaTeX inline math delimiters \( \) with LaTeX inline math delimiters $
				let latexOutput = selection.replace(
					/\\\(\s*(.*?)\s*\\\)/g,
					(match, p1) => `$${p1}$`
				);
				// Replace KaTeX block math delimiters \[ \] with LaTeX block math delimiters $$
				latexOutput = latexOutput.replace(
					/\\\[\s*(.*?)\s*\\\]/g,
					(match, p1) => `$$${p1}$$`
				);

				editor.replaceSelection(latexOutput);
				new Notice("KaTeX to LaTeX conversion completed!");
			},
		});
	}

	onunload() {}
}
