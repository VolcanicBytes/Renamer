import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let directJump: boolean = getDirectJumpPref();

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('occurrences-jumper'))
				directJump = getDirectJumpPref();
		}),
		vscode.commands.registerCommand('occurrences-jumper.toggleJumpMode', async () => {
			directJump = !directJump;
			setDirectJumpPref(directJump);
		}),
		vscode.commands.registerCommand('occurrences-jumper.next', async () => {
			try {
				const textEditor = vscode.window.activeTextEditor;
				if (textEditor === undefined || textEditor.selection === undefined)
					return;
				// tokenizeCurrentDocument();

				const doc = textEditor.document;
				const activeRange = new vscode.Range(textEditor.selection.start, textEditor.selection.end);
				var selectedText = doc.getText(textEditor.selection);
				if (!directJump) {
					if (await directJumpNext(doc, textEditor, activeRange))
						return;
				}
				var lastLine = doc.lineAt(doc.lineCount - 1);
				var text = doc.getText(new vscode.Range(textEditor.selection.start, lastLine.range.end));

				var startOffset = doc.offsetAt(textEditor.selection.active) - selectedText.length;
				var index = text.indexOf(selectedText, selectedText.length);
				if (index === -1) {
					text = doc.getText(new vscode.Range(new vscode.Position(0, 0), textEditor.selection.start));
					index = text.indexOf(selectedText);
					startOffset = 0;
					if (index === -1)
						return;
				}

				const offset = startOffset + index;
				const endOffset = offset + selectedText.length;
				textEditor.selection = new vscode.Selection(doc.positionAt(offset), doc.positionAt(endOffset));
				textEditor.revealRange(textEditor.selection);
			} catch (err) {
				vscode.window.showErrorMessage("jumping error: {" + err + "}");
			}
		}),
		vscode.commands.registerCommand('occurrences-jumper.previous', async () => {
			try {
				const textEditor = vscode.window.activeTextEditor;
				if (textEditor === undefined || textEditor.selection === undefined)
					return;
				// tokenizeCurrentDocument();
				const doc = textEditor.document;
				const selection = doc.getText(textEditor.selection);

				const activeRange = new vscode.Range(textEditor.selection.start, textEditor.selection.end);
				if (!directJump) {
					if (await directJumpPrevious(doc, textEditor, activeRange))
						return;
				}

				let text = doc.getText(new vscode.Range(new vscode.Position(0, 0), textEditor.selection.start));

				let startOffset = 0;
				var index = text.lastIndexOf(selection);
				if (index === -1) {
					var lastLine = doc.lineAt(doc.lineCount - 1);
					text = doc.getText(new vscode.Range(textEditor.selection.end, lastLine.range.end));
					index = text.lastIndexOf(selection);
					startOffset = doc.offsetAt(textEditor.selection.active);
					if (index === -1)
						return;
				}

				const offset = startOffset + index;
				const endOffset = offset + selection.length;
				textEditor.selection = new vscode.Selection(textEditor.document.positionAt(offset), textEditor.document.positionAt(endOffset));
				textEditor.revealRange(textEditor.selection);
			} catch (err) {
				vscode.window.showErrorMessage("jumping error: {" + err + "}");
			}
		}),

	);

	async function directJumpNext(doc: vscode.TextDocument, textEditor: vscode.TextEditor, activeRange: vscode.Range) {
		const places: vscode.DocumentHighlight[] = await getPlaces(doc.uri, textEditor.selection.active);
		if (places.length > 1) {
			const placeList = places;
			const placeListCount = placeList.length;
			let currentPosition = 0;
			for (let i = 0; i < placeListCount; i++) {
				const place = placeList[i];
				if (place.range.isEqual(activeRange)) {
					currentPosition = i;
					break;
				}
			}

			let place = currentPosition == placeList.length - 1 ? placeList[0] : placeList[currentPosition + 1];
			textEditor.selection = new vscode.Selection(place.range.start, place.range.end);
			textEditor.revealRange(textEditor.selection);
			return true;
		}
		return false;
	}
	async function directJumpPrevious(doc: vscode.TextDocument, textEditor: vscode.TextEditor, activeRange: vscode.Range) {
		const places: vscode.DocumentHighlight[] = await getPlaces(doc.uri, textEditor.selection.active);
		if (places.length > 1) {
			const placeList = places;
			const placeListCount = placeList.length;
			let currentPosition = 0;
			for (let i = 0; i < placeListCount; i++) {
				const place = placeList[i];
				if (place.range.isEqual(activeRange)) {
					currentPosition = i;
					break;
				}
			}

			let place = currentPosition > 0 ? placeList[currentPosition - 1] : placeList[placeList.length - 1];
			textEditor.selection = new vscode.Selection(place.range.start, place.range.end);
			textEditor.revealRange(textEditor.selection);
			return true;
		}
		return false;
	}
}

let tokens: Array<string> = new Array();

async function getPlaces(uri: vscode.Uri, position: vscode.Position): Promise<vscode.DocumentHighlight[]> {
	return await vscode.commands.executeCommand<vscode.DocumentHighlight[]>('vscode.executeDocumentHighlights', uri, position) ?? new Array<vscode.DocumentHighlight>();
}

function getDirectJumpPref(): boolean {
	return vscode.workspace.getConfiguration('occurrences-jumper').get<boolean>('useDirectJump', false);
}
function setDirectJumpPref(value: boolean) {
	return vscode.workspace.getConfiguration('occurrences-jumper').update('useDirectJump', value);
}

async function tokenizeCurrentDocument() {
	tokens = new Array();
	const textEditor = vscode.window.activeTextEditor;
	if (!textEditor)
		return;
	const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>('vscode.executeDocumentSymbolProvider', textEditor.document.uri);
	if (!symbols)
		return;
	for (let i = 0; i < symbols.length; i++) {
		const s = symbols[i];
		if (s.kind == vscode.SymbolKind.Variable) {
			const range = s.range;
			tokens.push(s.name);
		}
	}
}

export function deactivate() { }
