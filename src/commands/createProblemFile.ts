import * as vscode from 'vscode';
import path from 'path';
import { promptForProblemId } from '../utils/fileParser';


const DEFAULT_EXTENSTION= 'py';

export async function createAndOpenProblemFile(context: vscode.ExtensionContext) {
    const workSpaceRootFolder = getWorkSpaceRootFolder();
    if (workSpaceRootFolder === null) {
        vscode.window.showErrorMessage('작업 영역이 없습니다. 폴더를 열고 문제를 생성해주세요.');
        return;
    }

    const problemId = await promptForProblemId();
    if (problemId === null) {
        return;
    }
    const filePath = await createFile(workSpaceRootFolder, `${problemId}.${DEFAULT_EXTENSTION}`);
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

async function createFile(rootUri: string, fileName: string) {
    const fileUri = path.join(rootUri, fileName);
    try {
        await vscode.workspace.fs.stat(vscode.Uri.file(fileUri));
        vscode.window.showErrorMessage(`파일이 이미 존재합니다: ${fileName}`);
        return null;
    } catch (error: any) {
        const encoder = new TextEncoder();
        const fileContent = encoder.encode('');

        await vscode.workspace.fs.writeFile(vscode.Uri.file(fileUri), fileContent);
        vscode.window.showInformationMessage(`파일을 생성했습니다: ${fileName}`);
        return fileUri;
    }
}

function getWorkSpaceRootFolder(): string | null {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        return workspaceFolders[0].uri.path;
    } else {
        return null;
    }
}