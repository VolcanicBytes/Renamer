import * as vscode from 'vscode';
import * as Case from 'case';
import * as path from 'path';
import { QuickInputProxy } from './quickInputProxy';
import { DocumentChangeTracker } from './documentChangeTracker';
import { DocumentChangeItem } from './documentChangeItem';
import { DocumentTokenizer } from './documentTokenizer';
import { Settings } from './Settings';

const proxy: QuickInputProxy = new QuickInputProxy(RenameCurrentFile);

export function activate(context: vscode.ExtensionContext) {


	const tracker: DocumentChangeTracker = new DocumentChangeTracker(onDidChangeDetected);

	Settings.Initialize();

	context.subscriptions.push(
		Settings.Subscribe(context),
		vscode.window.onDidChangeActiveTextEditor((e) => {
			tracker.Reset();
		}),
		vscode.workspace.onDidSaveTextDocument((e) => {
			tracker.Trigger(e);
		}),
		vscode.workspace.onDidChangeTextDocument((e) => {
			tracker.Update(e);
		}),
		vscode.commands.registerCommand('renamer.rename-current-file', async () => {
			try {
				const textEditor = vscode.window.activeTextEditor;
				if (textEditor === undefined || textEditor.selection === undefined)
					return;
				const doc = textEditor.document;
				const symbols = await DocumentTokenizer.tokenizeCurrentDocument();
				const items = expandItems(symbols);
				proxy.Show(path.basename(doc.uri.fsPath), items);
			} catch (err) {
				vscode.window.showErrorMessage("renaming error: {" + err + "}");
			}
		})
	);
}
async function RenameCurrentFile(newName: string) {
	const textEditor = vscode.window.activeTextEditor;
	if (textEditor === undefined || textEditor.selection === undefined)
		return;

	const doc = textEditor.document;
	const ext = path.extname(doc.uri.fsPath);
	let resultingName: string = `${newName}${ext}`;
	if (newName.includes('.'))
		resultingName = newName;
	const uri = vscode.Uri.file(path.join(path.dirname(doc.uri.fsPath), resultingName));

	const selection = vscode.window.activeTextEditor?.selection;
	const edit = new vscode.WorkspaceEdit();
	edit.renameFile(doc.uri, uri, { overwrite: true });
	return await vscode.workspace.applyEdit(edit).then(() => {
		const textEditor = vscode.window.activeTextEditor;
		if (selection && textEditor)
			textEditor.selections = [selection];
		return vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');
	});
}

function expandItems(tokens: DocumentChangeItem[]): vscode.QuickPickItem[] {
	const quickPickItems = new Array<vscode.QuickPickItem>();
	const tokensCount = tokens.length;
	for (let i = 0; i < tokensCount; i++) {
		const token = tokens[i];
		quickPickItems.push(...expandItem(token));
	}
	return quickPickItems;
}
function expandItem(token: DocumentChangeItem): vscode.QuickPickItem[] {
	const quickPickItems = new Array<vscode.QuickPickItem>();
	quickPickItems.push({ label: token.name, description: 'unchanged' });
	quickPickItems.push({ label: Case.upper(token.name), description: 'upper' });
	quickPickItems.push({ label: Case.lower(token.name), description: 'lower' });
	quickPickItems.push({ label: Case.capital(token.name), description: 'capital' });
	quickPickItems.push({ label: Case.snake(token.name), description: 'snake' });
	quickPickItems.push({ label: Case.pascal(token.name), description: 'pascal' });
	quickPickItems.push({ label: Case.camel(token.name), description: 'camel' });
	quickPickItems.push({ label: Case.kebab(token.name), description: 'kebab' });
	quickPickItems.push({ label: Case.header(token.name), description: 'header' });
	quickPickItems.push({ label: Case.constant(token.name), description: 'constant' });
	quickPickItems.push({ label: Case.title(token.name), description: 'title' });
	quickPickItems.push({ label: Case.sentence(token.name), description: 'sentence' });
	quickPickItems.push({ label: Case.flip(token.name), description: 'flip' });
	quickPickItems.push({ label: Case.random(token.name), description: 'random' });

	return quickPickItems;
}

function onDidChangeDetected(docPath: string, item: DocumentChangeItem) {
	const items = expandItem(item);
	vscode.window.activeTextEditor
	proxy.Show(path.basename(docPath), items);
}

export function deactivate() { }
