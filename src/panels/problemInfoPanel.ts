import * as vscode from 'vscode';
import * as fs from 'fs';
import { Problem, ProblemStats } from "../types";
import { currentOpendFile } from '../commands/openProblemInfo';

export function createProblemInfoPanel(problem: Problem, context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        'BOJ Tester',
        `문제`,
        vscode.ViewColumn.Beside,
        {
            enableScripts: true
        }
    );

    panel.webview.html = getWebviewContent(problem);

    panel.webview.onDidReceiveMessage(
        async (message) => {
            if (message.command === 'copySourceCode') {
                if (currentOpendFile !== undefined) {
                    const fileContent = fs.readFileSync(currentOpendFile, 'utf-8');
                    await vscode.env.clipboard.writeText(fileContent);
                } 
            }
        },
        undefined,
        context.subscriptions
    );
    return panel;
}

export function getWebviewContent(problem: Problem) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${problem.id}</title>
        ${CSS}
    </head>
    <body>
        <a href="https://www.acmicpc.net/problem/${problem.id}">
            <h1>${problem.id} - ${problem.title}</h1>
        </a>
        <a href="https://www.acmicpc.net/submit/${problem.id}">
            <button class="submit">제출하기</button>
        </a>
        ${getProblemStatsTable(problem.problemStats)}
        <h2>문제</h2>
        ${problem.description}
        <h2>입력</h2>
        ${problem.inputDiscription}
        <h2>출력</h2>
        ${problem.outputDescription}
        <h2>테스트 케이스</h2>
        ${getTestCases(problem.inputs, problem.outputs)}
        <a href="https://www.acmicpc.net/submit/${problem.id}">
            <button class="submit">제출하기</button>
        </a>
        ${SCRIPT}
        </body>
    </html>
    `;
}

function getProblemStatsTable(problemStats: ProblemStats) {
    return `
        <table class="problem-stats-table">
            <thead>
                <tr>
                    <th>시간 제한</th>
                    <th>메모리 제한</th>
                    <th>제출</th>
                    <th>정답</th>
                    <th>맞힌 사람</th>
                    <th>정답 비율</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${problemStats.timeLimit}</td>
                    <td>${problemStats.memoryLimit}</td>
                    <td>${problemStats.submissions}</td>
                    <td>${problemStats.correctSubmissions}</td>
                    <td>${problemStats.solvers}</td>
                    <td>${problemStats.correctRate} %</td>
                </tr>
            </tbody>
        </table>
    `;
}

function getTestCases(inputs: string[], outputs: string[]) {
    let html = `<div>`;
    for (let i = 0; i < inputs.length; i++) {
        html = html + `<div class="example">
                    <div class="input">
                        <h3>입력 ${i + 1}</h3>
                        <pre>${inputs[i]}</pre>
                    </div>
                    <div class="output">
                        <h3>출력 ${i + 1}</h3>
                        <pre>${outputs[i]}</pre>
                    </div>
                </div>
                `;
    }
    return html + '</div>';
}

const SCRIPT = `
        <script>
            const vscode = acquireVsCodeApi();
            
            document.querySelector('.submit').addEventListener('click', () => {
                vscode.postMessage({ command: 'copySourceCode' });
            });

            window.addEventListener('message', event => {
                const message = event.data;
                if (message.command === 'showNotification') {
                    alert(message.text);
                }
            });
        </script>
`;

const CSS = `
    <style>
        :root {
            --container-padding: 20px;
            --input-padding-vertical: 6px;
            --input-padding-horizontal: 4px;
            --input-margin-vertical: 4px;
            --input-margin-horizontal: 0;
        }

        body {
            padding: 0 var(--container-padding);
            color: var(--vscode-foreground);
            font-size: var(--vscode-font-size);
            font-weight: var(--vscode-font-weight);
            font-family: var(--vscode-font-family);
            background-color: var(--vscode-editor-background);
        }
        button {
            border: none;
            padding: var(--input-padding-vertical) var(--input-padding-horizontal);
            width: 100%;
            text-align: center;
            outline: 1px solid transparent;
            outline-offset: 2px !important;
            color: var(--vscode-button-foreground);
            background: var(--vscode-button-background);
        }

        button:hover {
            cursor: pointer;
            background: var(--vscode-button-hoverBackground);
        }

        button:focus {
            outline-color: var(--vscode-focusBorder);
        }

        button.secondary {
            color: var(--vscode-button-secondaryForeground);
            background: var(--vscode-button-secondaryBackground);
        }

        button.secondary:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }

        a {
            text-decoration: none;
            color: inherit;
        }

        h1 {
            position: relative;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }

        h1::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100vw;
            height: 1px;
            background-color:rgb(87, 87, 87);
        }

        h2 {
            position: relative;
            padding-bottom: 10px;
            margin-bottom: 20px;
            display: inline-block;
            border-bottom: 1px solid #0076C0;
        }

        h2::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100vw;
            height: 1px;
            background-color:rgb(87, 87, 87);
        }

        h3 {
            position: relative;
            padding-bottom: 10px;
            margin-bottom: 20px;
            display: inline-block;
            border-bottom: 1px solid #0076C0;
        }

        h3::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100vw;
            height: 1px;
            background-color:rgb(87, 87, 87);
        }

        pre {
            padding: 10px;
            background-color:rgb(53, 53, 53);
        }

        p {
            font-size: 14px;
        }

        .problem-stats-table {
            border-collapse: collapse;
            margin: 25px 0;
            width: 100%;
            text-align: center;
        }

        .problem-stats-table thead tr {
            font-weight: bold;
            border-bottom: 1px solid rgb(134, 134, 134)
        }

        .problem-stats-table th, .problem-stats-table td {
            padding: 12px 15px;
        }

        .example-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .example {
            display: flex;
            gap: 20px;

            padding: 10px;
            border-radius: 5px;
        }

        .input, .output {
            flex: 1;
        }

    </style>
`;