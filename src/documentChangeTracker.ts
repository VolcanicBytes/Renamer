import * as vscode from 'vscode';
import { DocumentChangeItem } from './documentChangeItem';
import { DocumentTokenizer } from './documentTokenizer';
import { Settings } from './Settings';

export class DocumentChangeTracker {

    private detectedChangeItem: DocumentChangeItem | undefined;
    private initialList: DocumentChangeItem[] | undefined = undefined;
    constructor(private onDidChangesDetected: (path: string, symbol: DocumentChangeItem) => void) {

    }

    /**
     * Update
     */
    public async Update(e: vscode.TextDocumentChangeEvent) {
        if (!Settings.Enabled || e.contentChanges.length == 0)
            return;

        this.detectedChangeItem = undefined;
        let forceChanges = false;
        if (!this.initialList) {
            await this.Reset();
            forceChanges = true;
            if (!this.initialList)
                return;
        }

        const changedItemList = e.contentChanges;
        const changedListCount = changedItemList.length;
        for (let index = 0; index < changedListCount; index++) {
            const changedItem = changedItemList[index];

            const itemList = this.initialList;
            const itemListCount = itemList.length;
            for (let index = 0; index < itemListCount; index++) {
                const item = itemList[index];
                const nearestToken = await DocumentTokenizer.getNearestToken(changedItem.range);
                if (nearestToken && (forceChanges || (item.region.intersection(nearestToken.region) || nearestToken.region.intersection(item.region)) && item.name !== nearestToken.name)) {
                    this.detectedChangeItem = item;
                    this.detectedChangeItem.name = nearestToken.name;
                }
            }
        }
    }
    public async Trigger(doc: vscode.TextDocument) {

        if (!Settings.Enabled || !this.initialList || !this.detectedChangeItem || Settings.BlackList.includes(doc.languageId)) {
            return;
        }

        await this.onDidChangesDetected(doc.uri.fsPath, this.detectedChangeItem);
        await this.Reset();
    }

    /**
     * Reset
     */
    public async Reset() {
        if (!Settings.Enabled)
            return;
        this.initialList = await DocumentTokenizer.tokenizeCurrentDocument();
        this.detectedChangeItem = undefined;
    }

}