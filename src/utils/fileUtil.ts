import * as vscode from 'vscode';
import path from 'path';
import { getDefaultLanguage, getDefaultPath } from './configuration';
import { FILE_TEMPLATES } from './fileTemplates';

export async function openFile(filePath: vscode.Uri) {
    
    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(document, {
        viewColumn: vscode.ViewColumn.One,
        preview: false
    });  
}

export async function createProblemFile() {
    const filePath = getFilePath();
    if (filePath === null) {
        return null;
    }

    const problemId = await promptForProblemId();
    if (problemId === null) {
        return null;
    }
    const extension = getDefaultLanguage();
    if (!extension) {
        return null;
    }

    const createdFilePath = await createFile(filePath, `${problemId}.${extension}`);
    if (createdFilePath === null) {
        return null;
    }
    return vscode.Uri.file(createdFilePath);
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

function getFilePath(): string | null {
    const defaultPath = getDefaultPath();
    if (defaultPath) {
        return defaultPath;
    }
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        return workspaceFolders[0].uri.fsPath;
    } else {
        vscode.window.showErrorMessage('작업 영역이 없습니다. 폴더를 열고 문제를 생성해주세요. 혹은 설정창에서 기본 폴더를 설정해주세요.');
        return null;
    }
}

export function getCurrentOpenedFile() {
    const activeEditor = vscode.window.activeTextEditor;
    let file = undefined;
    if (activeEditor) {
        file = activeEditor.document.fileName; // 전체 경로

    }
    return file;
}

export function extractFileName(filePath: string) {
    const fileNameWithExtension = path.basename(filePath); // 경로에서 파일명 추출
    const fileName = fileNameWithExtension.split(".").slice(0, -1).join("."); // 확장자 제거
    return fileName;
}

function isNumber(fileName: string) {
    return /^\d+$/.test(fileName);
}

export async function getProblemId(editor: vscode.TextEditor): Promise<number | null> {
    const fileName = extractFileName(editor.document.fileName);

    if (isNumber(fileName)) {
        return Number(fileName);
    }

    return await promptForProblemId();
}

export async function promptForProblemId(): Promise<number | null> {
    const userInput = await vscode.window.showInputBox({
        placeHolder: 'Enter a value',
        prompt: '문제의 번호를 입력해주세요.',
        validateInput: (value) => {
            if (!value) { return '값을 입력해야 합니다.'; }
            if (!/^\d+$/.test(value)) { return '숫자만 입력해야 합니다.'; }
            return null;
        }
    });

    if (!userInput) {
        vscode.window.showWarningMessage('입력이 취소되었습니다.');
        return null;
    }

    return Number(userInput);
}