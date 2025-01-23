import * as vscode from 'vscode';

export function getCurrentOpenedFile() {
    const activeEditor = vscode.window.activeTextEditor;
    let file = undefined;
    if (activeEditor) {
        file = activeEditor.document.fileName; // 전체 경로

    }
    return file;
}

export function extractFileName(filePath: string) {
    const fileNameWithExtension = filePath.split("/").pop() || "";
    const fileName = fileNameWithExtension.split(".").slice(0, -1).join(".");
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
