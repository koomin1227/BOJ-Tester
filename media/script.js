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

document.querySelectorAll('.delete-test-case-btn').forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        vscode.postMessage({ command: 'deleteTestCase', target: targetId });
    });
});

document.querySelector('.run-all-test-cases-btn').addEventListener('click', () => {
    vscode.postMessage({ command: 'runAllTestCases' });
});

document.getElementById('addTestCase').addEventListener('click', () => {
    const testCaseContainer = document.getElementById('testCaseContainer');

    const testCaseForm = document.createElement('div');
    testCaseForm.id = 'testCaseForm';
    testCaseForm.innerHTML = `
    <div class="example">
        <div class="input">
            <div class="input-head">
                <h3>입력</h3>
            </div>
            <textarea id="inputField" class="test-case-textarea" rows="4" placeholder="입력값을 입력하세요..."></textarea>
        </div>
        <div class="output">
            <div class="input-head">
                <h3>출력</h3>
            </div>
            <textarea id="outputField" class="test-case-textarea" rows="4" placeholder="출력값을 입력하세요..."></textarea>
        </div>
    </div>
    <div class="example">
        <button class="vs-style" id="confirmAddTestCase">추가</button>
        <button class="vs-style second-button" id="cancelAddTestCase">취소</button>
    </div>
    `;

    testCaseContainer.appendChild(testCaseForm);

    document.getElementById(`confirmAddTestCase`).addEventListener('click', () => {
        const input = document.getElementById(`inputField`).value;
        const output = document.getElementById(`outputField`).value;


        vscode.postMessage({ 
            command: 'addTestCase',
            input : input.trim(),
            output : output.trim(),
        });

        testCaseForm.remove();
    });

    document.getElementById(`cancelAddTestCase`).addEventListener('click', () => {
        testCaseForm.remove();
    });
});


