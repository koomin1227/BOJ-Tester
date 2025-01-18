import * as vscode from 'vscode';

let currentPanel: vscode.WebviewPanel | undefined = undefined;

export async function openProblemInfo(context: vscode.ExtensionContext) {
    if (currentPanel) {
        currentPanel.reveal(vscode.ViewColumn.Beside);
    } else {
        const currentOpenedProblemId = getCurrentOpenedProblemId();
        if (currentOpenedProblemId === null) {
            vscode.window.showWarningMessage('열려있는 문제 번호 파일이 없습니다.');
            return;
        }

        currentPanel = vscode.window.createWebviewPanel(
            'BOJ Tester',
            `${currentOpenedProblemId}`,
            vscode.ViewColumn.Beside,
            {
                enableScripts: true
            }
        );

        currentPanel.webview.html = getWebviewContent();

        currentPanel.onDidDispose(
            () => {
                currentPanel = undefined;
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

function getWebviewContent() {
    return `<h1>Test</h1>`;
}