const vscode = acquireVsCodeApi();

const toggleButton = document.getElementById("toggleIdeFeature");

vscode.postMessage({ command: 'requestData' });
window.addEventListener('message', (event) => {
    const message = event.data;
    if (message.command === 'sendData') {
        toggleButton.innerText = message.data;
    }
});

toggleButton.addEventListener("click", function() {
    if (toggleButton.innerText === "IDE 기능 켜기") {
        toggleButton.innerText = "IDE 기능 끄기";
    } else {
        toggleButton.innerText = "IDE 기능 켜기";
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

document.getElementById('toggleIdeFeature').addEventListener('click', () => {
    vscode.postMessage({
        command: 'toggleIdeFeature'
    });
});