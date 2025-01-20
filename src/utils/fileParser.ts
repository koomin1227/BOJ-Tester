import * as vscode from 'vscode';

export function getCurrentOpenedProblemId(): number | null {
    const activeEditor = vscode.window.activeTextEditor;
    let problemId = null;
    if (activeEditor) {
        let filePath = activeEditor.document.fileName; // 전체 경로
        const fileName = extractFileName(filePath);
        if (isNumber(fileName)) {
            problemId = Number(fileName);
        }
    }
    return problemId;
}

export function getCurrentOpenedFile() {
    const activeEditor = vscode.window.activeTextEditor;
    let file = undefined;
    if (activeEditor) {
        file = activeEditor.document.fileName; // 전체 경로
    
    }
    return file;
}

function extractFileName(filePath: string) {
    const fileNameWithExtension = filePath.split("/").pop() || "";
    const fileName = fileNameWithExtension.split(".").slice(0, -1).join(".");
    return fileName;
}

function isNumber(fileName: string) {
    return /^\d+$/.test(fileName);
}
