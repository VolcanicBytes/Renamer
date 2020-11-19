import * as vscode from 'vscode';

export class QuickInputProxy {

    static alreadyOpened: boolean = false;

    private quickPick: vscode.QuickPick<vscode.QuickPickItem>;
    private allItems: vscode.QuickPickItem[] = new Array();
    /**
     *  Construct the quick pick
     */
    constructor(private accept: (e: string) => void) {
        this.quickPick = vscode.window.createQuickPick();
        this.quickPick.title = "New Name (Press 'Enter' to confirm or 'Escape' to cancel)";
        this.quickPick.onDidChangeActive((e: any[]) => {
            if (e.length > 0)
                this.quickPick.value = e[0].label.toString();
        });
        this.quickPick.onDidHide((e) => {
            QuickInputProxy.alreadyOpened = false;
        });
        this.quickPick.onDidAccept(e => {
            accept(this.quickPick.value);
            this.quickPick.hide();
        })
    }

    /**
     * Show
     */
    public Show(currentName: string, items: vscode.QuickPickItem[]) {
        if (QuickInputProxy.alreadyOpened)
            return;
        QuickInputProxy.alreadyOpened = true;
        items.splice(0, 0, { label: currentName, description: 'current file name' });
        this.quickPick.items = this.allItems = items;
        // this.quickPick.value = currentName;
        this.quickPick.show();
    }
}