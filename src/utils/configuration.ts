import * as vscode from 'vscode';

export async function checkSettingsAndOpenIfMissing(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('BOJ-Tester');
    const settingValue = config.get<string>('defaultLanguage', '');

    if (!settingValue) {
        vscode.window.showWarningMessage('설정이 필요합니다. 설정 페이지로 이동합니다.');
        await vscode.commands.executeCommand('workbench.action.openSettings', `@ext:koomin1227.boj-tester`);
    }
}

export function getDefaultLanguage() {
    const config = vscode.workspace.getConfiguration('BOJ-Tester');
    return config.get('defaultLanguage');
}