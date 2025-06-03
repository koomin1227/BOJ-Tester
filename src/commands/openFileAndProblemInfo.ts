import * as vscode from 'vscode';
import { openProblemInfo } from './openProblemInfo';
import { openFile } from '../utils/fileUtil';

export async function openFileAndProblemInfo(context: vscode.ExtensionContext, fileUri: vscode.Uri) {
    if (fileUri === null) {
        return;
    }
    await openFile(fileUri);

    await openProblemInfo(context);
}
