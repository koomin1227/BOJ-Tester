const vscode = acquireVsCodeApi();

const toggleButton = document.getElementById("toggleAutocomplete");

vscode.postMessage({ command: 'requestData' });
window.addEventListener('message', (event) => {
    const message = event.data;
    if (message.command === 'sendData') {
        toggleButton.innerText = message.data;
    }
});

toggleButton.addEventListener("click", function() {
    if (toggleButton.innerText === "자동완성 켜기") {
        toggleButton.innerText = "자동완성 끄기";
    } else {
        toggleButton.innerText = "자동완성 켜기";
    }
});

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

document.getElementById('toggleAutocomplete').addEventListener('click', () => {
    vscode.postMessage({
        command: 'toggleAutocomplete'
    });
});