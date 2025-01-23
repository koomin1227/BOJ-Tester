import * as vscode from 'vscode';
import { createProblemFile } from '../utils/fileGenerator';
import { openProblemInfo } from './openProblemInfo';

export async function createAndOpenProblemFile(context: vscode.ExtensionContext) {
    const filePath = await createProblemFile();
    if (filePath === null) {
        return;
    }
    await openFile(filePath);
}

async function openFile(filePath: string) {
    const document = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
    await vscode.window.showTextDocument(document, {
        viewColumn: vscode.ViewColumn.One,
        preview: false
    });  
}
