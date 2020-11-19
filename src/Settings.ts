import * as vscode from 'vscode';
import { Constants } from './constants';

export class Settings {

    public static Enabled: boolean;
    public static BlackList: Array<string>;

    public static Initialize() {
        this.Reload();
    }

    public static Reload() {
        this.Enabled = this.getEnabledPref();
        this.BlackList = this.getBlackListPref();
    }

    public static Subscribe(context: vscode.ExtensionContext) {
        return vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration(Constants.ExtensionName)) {
                this.Reload();
            }
        });
    }


    private static getEnabledPref(): boolean {
        return vscode.workspace.getConfiguration(Constants.ExtensionName).get<boolean>('enabled', true);
    }
    private static getBlackListPref(): Array<string> {
        return vscode.workspace.getConfiguration(Constants.ExtensionName).get<Array<string>>('ignoredLanguageIdList', new Array());
    }

}