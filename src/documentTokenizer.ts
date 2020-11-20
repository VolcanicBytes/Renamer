import * as vscode from 'vscode';
import { DocumentChangeItem } from './documentChangeItem';

export class DocumentTokenizer {

    static recursiveTokenize(symbols: vscode.DocumentSymbol[], tokens: Array<DocumentChangeItem>) {
        for (let i = 0; i < symbols.length; i++) {
            const s = symbols[i];
            if (s.kind == vscode.SymbolKind.Namespace) {
                this.recursiveTokenize(s.children, tokens);
            }
            else {
                const item = new DocumentChangeItem(s.kind, s.selectionRange, s.name);
                tokens.push(item);
            }
        }
    }

    static async tokenizeCurrentDocument() {
        const tokens: Array<DocumentChangeItem> = new Array();

        const textEditor = vscode.window.activeTextEditor;
        if (!textEditor)
            return tokens;
        const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>('vscode.executeDocumentSymbolProvider', textEditor.document.uri);
        if (!symbols)
            return tokens;
        for (let i = 0; i < symbols.length; i++) {
            const s = symbols[i];
            if (s.kind == vscode.SymbolKind.Namespace) {
                this.recursiveTokenize(s.children, tokens);
            }
            else {
                const item = new DocumentChangeItem(s.kind, s.selectionRange, s.name);
                tokens.push(item);
            }

            // enum SymbolKind {
            //     File = 0,
            //     Module = 1,
            //     Namespace = 2,
            //     Package = 3,
            //     Class = 4,
            //     Method = 5,
            //     Property = 6,
            //     Field = 7,
            //     Constructor = 8,
            //     Enum = 9,
            //     Interface = 10,
            //     Function = 11,
            //     Variable = 12,
            //     Constant = 13,
            //     String = 14,
            //     Number = 15,
            //     Boolean = 16,
            //     Array = 17,
            //     Object = 18,
            //     Key = 19,
            //     Null = 20,
            //     EnumMember = 21,
            //     Struct = 22,
            //     Event = 23,
            //     Operator = 24,
            //     TypeParameter = 25
            // }

            // if (s.kind == vscode.SymbolKind.Variable) {
            //     const item = new DocumentChangeItem(s.kind, s.selectionRange, s.name);
            //     tokens.push(item);
            // }
        }

        return tokens;
    }


    static async getNearestToken(region: vscode.Range) {
        const tokens = await this.tokenizeCurrentDocument();
        const count = tokens.length;
        for (let i = 0; i < count; i++) {
            const item = tokens[i];

            if ((item.region.intersection(region) || region.intersection(item.region))) {
                return new DocumentChangeItem(item.symbol, item.region, item.name);
            }
        }

    }


}