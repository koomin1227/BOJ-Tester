import * as vscode from 'vscode';
import { parseProlem } from '../utils/problemParser';
import { createProblemInfoPanel, getWebviewContent } from '../panels/problemInfoPanel';
import { Problem } from '../types';

let currentPanel: vscode.WebviewPanel | undefined = undefined;
let currentProblem: Problem | undefined = undefined;

export async function openProblemInfo(context: vscode.ExtensionContext) {
    if (currentPanel) {
        const currentOpenedProblemId = getCurrentOpenedProblemId();

        if (currentProblem !== undefined && currentOpenedProblemId === null) {
            vscode.window.showWarningMessage('열려있는 문제 번호 파일이 없습니다.');
        } 
        else if (currentProblem !== undefined && currentOpenedProblemId !== null) {
            if (currentProblem.id !== currentOpenedProblemId) {
                currentProblem = await parseProlem(currentOpenedProblemId);
                currentPanel.webview.html = getWebviewContent(currentProblem);
            }
            currentPanel.reveal(vscode.ViewColumn.Beside);
        }
    } else {
        const currentOpenedProblemId = getCurrentOpenedProblemId();
        if (currentOpenedProblemId === null) {
            vscode.window.showWarningMessage('열려있는 문제 번호 파일이 없습니다.');
            return;
        }
        currentProblem = await parseProlem(currentOpenedProblemId);
        currentPanel = createProblemInfoPanel(currentProblem);

        currentPanel.onDidDispose(
            () => {
                currentPanel = undefined;
                currentProblem = undefined;
            },
            null,
            context.subscriptions
        );
    }

}

function getCurrentOpenedProblemId(): number | null {
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

function extractFileName(filePath: string) {
    const fileNameWithExtension = filePath.split("/").pop() || "";
    const fileName = fileNameWithExtension.split(".").slice(0, -1).join(".");
    return fileName;
}

function isNumber(fileName: string) {
    return /^\d+$/.test(fileName);
}

