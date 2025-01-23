const vscode = acquireVsCodeApi();

document.getElementById('openProblemInfo').addEventListener('click', () => {
    vscode.postMessage({
        command: 'openProblemInfo'
    });
});

document.getElementById('createProblem').addEventListener('click', () => {
    vscode.postMessage({
        command: 'createProblem'
    });
});