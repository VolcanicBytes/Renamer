import * as vscode from 'vscode';
import { Constants } from './constants';
import { RenamedRegexItem } from './RenamedRegexItem';

export class Settings {

    public static Enabled: boolean;
    public static BlackList: Array<string>;
    public static RegexList: Array<RenamedRegexItem>;
    public static ForceRegex: boolean;

    public static Initialize() {
        this.Reload();
    }

    public static Reload() {
        this.Enabled = this.getEnabledPref();
        this.BlackList = this.getBlackListPref();
        this.RegexList = this.getRegexListPref();
        this.ForceRegex = this.getForceRegexPref();
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
    private static getForceRegexPref(): boolean {
        return vscode.workspace.getConfiguration(Constants.ExtensionName).get<boolean>('forceRegex', false);
    }
    private static getBlackListPref(): Array<string> {
        return vscode.workspace.getConfiguration(Constants.ExtensionName).get<Array<string>>('ignoredLanguageIdList', new Array());
    }
    private static getRegexListPref(): Array<RenamedRegexItem> {
        const serializedItems: object | undefined = vscode.workspace.getConfiguration(Constants.ExtensionName).get<object>('regexList');
        let result = new Array<RenamedRegexItem>();
        if (serializedItems) {
            try {
                result = serializedItems as Array<RenamedRegexItem>;
            } catch (error) {
                vscode.window.showErrorMessage('Unable to parse the regexList:  ' + error);
            }
        }
        return result;
    }

}