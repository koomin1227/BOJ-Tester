const vscode = acquireVsCodeApi();

document.querySelectorAll('.submit').forEach(button => {
    button.addEventListener('click', function() {
        vscode.postMessage({ command: 'copySourceCode' });
    });
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

document.querySelectorAll('.run-test-case-btn').forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        vscode.postMessage({ command: 'runTestCase', target: targetId });
    });
});

document.querySelector('.run-all-test-cases-btn').addEventListener('click', () => {
    vscode.postMessage({ command: 'runAllTestCases' });
});


