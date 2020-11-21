import * as vscode from 'vscode';
import { DocumentChangeItem } from './documentChangeItem';
import { Settings } from './Settings';

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

        const symbols = Settings.ForceRegex ? undefined : await vscode.commands.executeCommand<vscode.DocumentSymbol[]>('vscode.executeDocumentSymbolProvider', textEditor.document.uri);
        if (!symbols) {
            return this.tokenizeWithRegex(textEditor.document);
        }
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
    static tokenizeWithRegex(document: vscode.TextDocument) {
        const tokens: Array<DocumentChangeItem> = new Array();
        const text = document.getText();
        const regexList = Settings.RegexList;
        const regexListCount = regexList.length;
        for (let index = 0; index < regexListCount; index++) {
            const regexItem = regexList[index];
            if (regexItem.languageId !== document.languageId || !regexItem.regex)
                continue;

            const itemList = regexItem.regex;
            const itemListCount = itemList.length;
            for (let i = 0; i < itemListCount; i++) {
                const regexBody = itemList[i];
                const group: number = regexItem.captureGroup != undefined && regexItem.captureGroup.length > i ? regexItem.captureGroup[i] : 1;
                let match = null;
                const regex = new RegExp(regexBody, 'g');
                while ((match = regex.exec(text)) != null) {
                    try {
                        const position = document.positionAt(match.index)
                        const line = document.lineAt(position.line);
                        const lineText = line.text;
                        const name = match[group];
                        const wordStartOffset = lineText.search(name);
                        const startPos = new vscode.Position(line.lineNumber, wordStartOffset);
                        const endPos = new vscode.Position(line.lineNumber, wordStartOffset + name.length);
                        const range = new vscode.Range(startPos, endPos);
                        tokens.push(new DocumentChangeItem(vscode.SymbolKind.Class, range, name.trim()))
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
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