import * as vscode from 'vscode';

import { openProblemInfo } from './openProblemInfo';
import { createProblemFile, openFile } from '../utils/fileUtil';

export async function createAndOpenProblemFile(context: vscode.ExtensionContext) {
    const filePath = await createProblemFile();
    if (filePath === null) {
        return;
    }
    await openFile(filePath);

    await openProblemInfo(context);
}
