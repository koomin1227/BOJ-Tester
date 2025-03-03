import * as vscode from 'vscode';

export async function toggleIdeFeature() {
    const editorConfig = vscode.workspace.getConfiguration('editor');
    const problemsConfig = vscode.workspace.getConfiguration('problems');

    let isFeatureEnabled = await getFeatureStatus(); 
    if (isFeatureEnabled) {
        await editorConfig.update('quickSuggestions', { other: false, comments: false, strings: false }, vscode.ConfigurationTarget.Global);
        await editorConfig.update('suggestOnTriggerCharacters', false, vscode.ConfigurationTarget.Global);
        await editorConfig.update('codeLens', false, vscode.ConfigurationTarget.Global);
        await editorConfig.update('lightbulb.enabled', false, vscode.ConfigurationTarget.Global);
        await editorConfig.update('hover.enabled', false, vscode.ConfigurationTarget.Global);
        await editorConfig.update('inlineSuggest.enabled', false, vscode.ConfigurationTarget.Global);
        await problemsConfig.update('visibility', false, vscode.ConfigurationTarget.Global);

        vscode.window.showInformationMessage('IDE 기능이 꺼졌습니다.');
    } else {
        await editorConfig.update('quickSuggestions', { other: true, comments: true, strings: true }, vscode.ConfigurationTarget.Global);
        await editorConfig.update('suggestOnTriggerCharacters', true, vscode.ConfigurationTarget.Global);
        await editorConfig.update('codeLens', true, vscode.ConfigurationTarget.Global);
        await editorConfig.update('lightbulb.enabled', true, vscode.ConfigurationTarget.Global);
        await editorConfig.update('hover.enabled', true, vscode.ConfigurationTarget.Global);
        await editorConfig.update('inlineSuggest.enabled', true, vscode.ConfigurationTarget.Global);
        await problemsConfig.update('visibility', true, vscode.ConfigurationTarget.Global);

        vscode.window.showInformationMessage('IDE 기능이 켜졌습니다.');
    }

    isFeatureEnabled = !isFeatureEnabled;
}

export async function getFeatureStatus(): Promise<boolean> {
    const editorConfig = vscode.workspace.getConfiguration('editor');
    const problemsConfig = vscode.workspace.getConfiguration('problems');

    const quickSuggestions = editorConfig.get<{ other: boolean; comments: boolean; strings: boolean }>('quickSuggestions', { other: true, comments: true, strings: true });
    const suggestOnTriggerCharacters = editorConfig.get<boolean>('suggestOnTriggerCharacters', true);
    const codeLens = editorConfig.get<boolean>('codeLens', true);
    const hoverEnabled = editorConfig.get<boolean>('hover.enabled', true);
    const problemVisibility = problemsConfig.get<boolean>('visibility', true);

    return quickSuggestions.other && suggestOnTriggerCharacters && codeLens && hoverEnabled && problemVisibility;
}
