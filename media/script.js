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
    const addTestCaseButton = document.getElementById('addTestCase');

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
    addTestCaseButton.hidden = true;

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
        addTestCaseButton.hidden = false;
    });
});

document.querySelectorAll('.edit-test-case-btn').forEach(button => {
    button.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target');
        const inputContainer = this.closest('.input');
        const outputContainer = inputContainer.nextElementSibling;
        const exampleContainer = this.closest('.example');

        const inputPreElement = inputContainer.querySelector('pre');
        const inputTextarea = document.createElement('textarea');
        inputTextarea.className = 'test-case-textarea';
        inputTextarea.rows = 4;
        inputTextarea.value = inputPreElement.textContent;
        inputPreElement.replaceWith(inputTextarea);

        const outputPreElement = outputContainer.querySelector('pre');
        const outputTextarea = document.createElement('textarea');
        outputTextarea.className = 'test-case-textarea';
        outputTextarea.rows = 4;
        outputTextarea.value = outputPreElement.textContent;
        outputPreElement.replaceWith(outputTextarea);

        const confirmButton = document.createElement('button');
        confirmButton.className = 'confirm-edit-btn vs-style';
        confirmButton.textContent = '수정 확인';
        confirmButton.setAttribute('data-target', targetId);

        const cancelButton = document.createElement('button');
        cancelButton.className = 'cancel-edit-btn vs-style second-button';
        cancelButton.textContent = '취소';
        cancelButton.setAttribute('data-target', targetId);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'example';

        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);
        exampleContainer.insertAdjacentElement('afterend', buttonContainer);

        this.hidden = true;

        confirmButton.addEventListener('click', function () {
            vscode.postMessage({ 
                command: 'editTestCase',
                target: targetId,
                input : inputTextarea.value.trim(),
                output : outputTextarea.value.trim(),
            });
            const updatedInputValue = inputTextarea.value;
            const newInputPreElement = document.createElement('pre');
            newInputPreElement.textContent = updatedInputValue;
            inputTextarea.replaceWith(newInputPreElement);

            const updatedOutputValue = outputTextarea.value;
            const newOutputPreElement = document.createElement('pre');
            newOutputPreElement.textContent = updatedOutputValue;
            outputTextarea.replaceWith(newOutputPreElement);

            confirmButton.remove();
            cancelButton.remove();
            button.hidden = false;
        });

        cancelButton.addEventListener('click', function () {
            const originalInputPreElement = document.createElement('pre');
            originalInputPreElement.textContent = inputPreElement.textContent;
            inputTextarea.replaceWith(originalInputPreElement);

            const originalOutputPreElement = document.createElement('pre');
            originalOutputPreElement.textContent = outputPreElement.textContent;
            outputTextarea.replaceWith(originalOutputPreElement);

            confirmButton.remove();
            cancelButton.remove();
            button.hidden = false;
        });
    });
});


