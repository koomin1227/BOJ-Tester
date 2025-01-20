const vscode = acquireVsCodeApi();

document.getElementById('openProblemInfo').addEventListener('click', () => {
    vscode.postMessage({
        command: 'openProblemInfo'
    });
});