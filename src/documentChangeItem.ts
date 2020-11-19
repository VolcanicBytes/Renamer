import * as vscode from 'vscode';

export class DocumentChangeItem {

    constructor(public symbol: vscode.SymbolKind, public region: vscode.Range, public name: string) {

    }

}