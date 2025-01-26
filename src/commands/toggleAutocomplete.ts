import * as vscode from 'vscode';

export async function toggleAutocomplete() {
    const config = vscode.workspace.getConfiguration('editor');

    let isFeatureEnabled = await getFeatureStatus(); 
    if (isFeatureEnabled) {
        await config.update('quickSuggestions', { other: false, comments: false, strings: false }, vscode.ConfigurationTarget.Global);
        await config.update('suggestOnTriggerCharacters', false, vscode.ConfigurationTarget.Global);
        await config.update('codeLens', false, vscode.ConfigurationTarget.Global);
        await config.update('lightbulb.enabled', false, vscode.ConfigurationTarget.Global);
        await config.update('hover.enabled', false, vscode.ConfigurationTarget.Global);
        await config.update('inlineSuggest.enabled', false, vscode.ConfigurationTarget.Global);

        vscode.window.showInformationMessage('자동완성 기능이 꺼졌습니다.');
    } else {
        await config.update('quickSuggestions', { other: true, comments: true, strings: true }, vscode.ConfigurationTarget.Global);
        await config.update('suggestOnTriggerCharacters', true, vscode.ConfigurationTarget.Global);
        await config.update('codeLens', true, vscode.ConfigurationTarget.Global);
        await config.update('lightbulb.enabled', true, vscode.ConfigurationTarget.Global);
        await config.update('hover.enabled', true, vscode.ConfigurationTarget.Global);
        await config.update('inlineSuggest.enabled', true, vscode.ConfigurationTarget.Global);

        vscode.window.showInformationMessage('자동완성 기능이 켜졌습니다.');
    }

    isFeatureEnabled = !isFeatureEnabled;
}

async function getFeatureStatus(): Promise<boolean> {
    const config = vscode.workspace.getConfiguration('editor');

    const quickSuggestions = config.get<{ other: boolean; comments: boolean; strings: boolean }>('quickSuggestions', { other: true, comments: true, strings: true });
    const suggestOnTriggerCharacters = config.get<boolean>('suggestOnTriggerCharacters', true);
    const codeLens = config.get<boolean>('codeLens', true);
    const hoverEnabled = config.get<boolean>('hover.enabled', true);

    return quickSuggestions.other && suggestOnTriggerCharacters && codeLens && hoverEnabled;
}
