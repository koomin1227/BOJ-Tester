import * as vscode from 'vscode';
import path from 'path';
import { promptForProblemId } from '../utils/fileParser';
import { getDefaultLanguage } from './configuration';
import { FILE_TEMPLATES } from './fileTemplates';

export async function createProblemFile() {
    const workSpaceRootFolder = getWorkSpaceRootFolder();
    if (workSpaceRootFolder === null) {
        return null;
    }

    const problemId = await promptForProblemId();
    if (problemId === null) {
        return null;
    }
    const extension = getDefaultLanguage();
    const filePath = await createFile(workSpaceRootFolder, `${problemId}.${extension}`);
    if (filePath === null) {
        return null;
    }
    return filePath;
}

async function createFile(rootUri: string, fileName: string) {
    const fileUri = path.join(rootUri, fileName);
    try {
        await vscode.workspace.fs.stat(vscode.Uri.file(fileUri));
        vscode.window.showErrorMessage(`파일이 이미 존재합니다: ${fileName}`);
        return null;
    } catch (error: any) {
        const encoder = new TextEncoder();
        const fileContent = encoder.encode(getTemplateContent(fileName));

        await vscode.workspace.fs.writeFile(vscode.Uri.file(fileUri), fileContent);
        vscode.window.showInformationMessage(`파일을 생성했습니다: ${fileName}`);
        return fileUri;
    }
}

function getTemplateContent(fileName: string) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension && FILE_TEMPLATES[extension] ? FILE_TEMPLATES[extension] : '';
}

function getWorkSpaceRootFolder(): string | null {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        return workspaceFolders[0].uri.path;
    } else {
        vscode.window.showErrorMessage('작업 영역이 없습니다. 폴더를 열고 문제를 생성해주세요.');
        return null;
    }
}