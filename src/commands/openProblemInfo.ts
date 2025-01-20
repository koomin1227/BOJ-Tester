import * as vscode from 'vscode';
import { ProblemInfoPanel } from '../panels/problemInfoPanel';

export async function openProblemInfo(context: vscode.ExtensionContext) {
    if (ProblemInfoPanel.currentPanel) {
        await ProblemInfoPanel.currentPanel.show();
    } else {
        await ProblemInfoPanel.create(context.extensionUri);
    }
}
