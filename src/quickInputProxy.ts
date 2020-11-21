import * as vscode from 'vscode';

export class QuickInputProxy {

    private timeout: NodeJS.Timeout | undefined;
    private lastSelectedLabel: string | undefined;
    private valueSelected: boolean = false;
    private valueAlreadySelected: boolean = false;
    static alreadyOpened: boolean = false;

    private quickPick: vscode.QuickPick<vscode.QuickPickItem>;

    private allItems: vscode.QuickPickItem[] = new Array();
    /**
     *  Construct the quick pick
     */
    constructor(private accept: (e: string) => void) {

        this.quickPick = vscode.window.createQuickPick();
        this.quickPick.title = "New Name (Press 'Enter' to confirm or 'Escape' to cancel)";

        this.quickPick.onDidChangeSelection((e) => {
            if (this.valueAlreadySelected || this.quickPick.value.length > 3)
                return;
            this.quickPick.value = e[0].label.toString();
            this.valueSelected = true;
            this.valueAlreadySelected = true;
        });

        this.quickPick.onDidHide((e) => {
            QuickInputProxy.alreadyOpened = false;
        });
        this.quickPick.onDidAccept(e => {
            if (this.valueSelected) {
                this.valueSelected = false;
                return;
            }
            accept(this.quickPick.value);
            this.quickPick.hide();
        })
    }

    private StartCountdown(): NodeJS.Timeout {
        return setTimeout(() => {
            this.valueAlreadySelected = false;
        }, 500);
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
        this.valueSelected = false;
        this.valueAlreadySelected = false;
        this.quickPick.value = '';
        this.quickPick.show();
    }
}