import * as vscode from 'vscode';

export class RenamedRegexItem {

    public languageId: string | undefined;
    public regex: Array<string> | undefined;
    public captureGroup: Array<number> | undefined;

    constructor() {

    }
}