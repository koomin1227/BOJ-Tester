import * as vscode from 'vscode';

export async function checkSettingsAndOpenIfMissing(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('BOJ-Tester');
    const settingValue = config.get<string>('defaultLanguage', '');

    if (!settingValue) {
        vscode.window.showWarningMessage('설정이 필요합니다. 설정 페이지로 이동합니다.');
        await vscode.commands.executeCommand('workbench.action.openSettings', `@ext:koomin1227.boj-tester`);
    }
}

export function getDefaultLanguage(): string | undefined {
    const config = vscode.workspace.getConfiguration('BOJ-Tester');
    const defaultLanguage = config.get<string>('defaultLanguage');
    if (!defaultLanguage) {
        vscode.window.showWarningMessage('기본 언어가 설정되지 않았습니다. 설정창에서 기본 언어를 설정해주세요.');
    }
    return defaultLanguage;
}

export function getDefaultPath(): string | undefined {
    const config = vscode.workspace.getConfiguration('BOJ-Tester');
    return config.get<string>('defaultPath');
}