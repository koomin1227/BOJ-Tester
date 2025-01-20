const vscode = acquireVsCodeApi();
            
document.querySelector('.submit').addEventListener('click', () => {
    vscode.postMessage({ command: 'copySourceCode' });
});

document.querySelectorAll('.input-copy-btn').forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        vscode.postMessage({ command: 'copyInput', target: targetId });
    });
});

document.querySelectorAll('.output-copy-btn').forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        vscode.postMessage({ command: 'copyOutput', target: targetId });
    });
});