import * as vscode from 'vscode';
import * as fs from 'fs';
import { Problem, ProblemStats } from "../types";
import { getCurrentOpenedFile, getCurrentOpenedProblemId } from '../utils/fileParser';
import { parseProlem } from '../utils/problemParser';
import { runAndPrintTestCase } from '../utils/testCaseRunner';

export class ProblemInfoPanel {
    public static currentPanel: ProblemInfoPanel | undefined;
    public static currentProblem: Problem | undefined = undefined;
    public static currentOpendFile: string | undefined = undefined;
	public static readonly viewType = 'BOJ Tester';

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

    public static async create(extensionUri: vscode.Uri) {
        const currentOpenedProblemId = getCurrentOpenedProblemId();
        if (currentOpenedProblemId === null) {
            vscode.window.showWarningMessage('열려있는 문제 번호 파일이 없습니다.');
            return;
        }
        ProblemInfoPanel.currentOpendFile = getCurrentOpenedFile();
        try {        
            ProblemInfoPanel.currentProblem = await parseProlem(currentOpenedProblemId);
            const panel = vscode.window.createWebviewPanel(
                ProblemInfoPanel.viewType,
                `문제`,
                vscode.ViewColumn.Beside,
                {
                    enableScripts: true
                }
            );
            ProblemInfoPanel.currentPanel = new ProblemInfoPanel(panel, extensionUri);
        } catch (error) {
            vscode.window.showWarningMessage('오류가 생겼습니다. 문제 번호나 인터넷 상태를 확인해주세요.');
        }
    }

    public async show() {
        const currentOpenedProblemId = getCurrentOpenedProblemId();

        if (ProblemInfoPanel.currentProblem !== undefined && currentOpenedProblemId === null) {
            vscode.window.showWarningMessage('오류가 생겼습니다. 문제 번호나 인터넷 상태를 확인해주세요.');
        } 
        else if (ProblemInfoPanel.currentProblem !== undefined && currentOpenedProblemId !== null) {
            if (ProblemInfoPanel.currentProblem.id !== currentOpenedProblemId) {
                ProblemInfoPanel.currentOpendFile = getCurrentOpenedFile();
                try {
                    ProblemInfoPanel.currentProblem = await parseProlem(currentOpenedProblemId);
                    ProblemInfoPanel.currentPanel!._panel.webview.html = this.getWebviewContent(ProblemInfoPanel.currentProblem);
                } catch (error) {
                    vscode.window.showWarningMessage('문제 번호가 잘 못 되었습니다.');
                }
            }
            ProblemInfoPanel.currentPanel!._panel.reveal(vscode.ViewColumn.Beside);
        }
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		this._panel = panel;
		this._extensionUri = extensionUri;
        this._panel.webview.html = this.getWebviewContent(ProblemInfoPanel.currentProblem!);
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);


        panel.webview.onDidReceiveMessage(
            async (message) => {
                if (message.command === 'copySourceCode') {
                    const fileContent = fs.readFileSync(ProblemInfoPanel.currentOpendFile!, 'utf-8');
                    await vscode.env.clipboard.writeText(fileContent);
                } else if (message.command === 'copyInput') {
                    await vscode.env.clipboard.writeText(ProblemInfoPanel.currentProblem!.inputs[message.target]!);
                } else if (message.command === 'copyOutput') {
                    await vscode.env.clipboard.writeText(ProblemInfoPanel.currentProblem!.outputs[message.target]!);
                } else if (message.command === 'runTestCase') {
                    runAndPrintTestCase(ProblemInfoPanel.currentOpendFile!, ProblemInfoPanel.currentProblem!, Number(message.target));
                }
            },
            undefined,
            this._disposables
        );
	}

    public dispose() {
        ProblemInfoPanel.currentPanel = undefined;
    }

    private getWebviewContent(problem: Problem): string {
		const stylesMainUri = this.getMediaFileUri('styles.css');
        const scriptMainUri = this.getMediaFileUri('script.js');
        const playIconUri = this.getMediaFileUri('play_icon.png');
        
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${problem.id}</title>
            <link href="${stylesMainUri}" rel="stylesheet">
            
        </head>
        <body>
            <a href="https://www.acmicpc.net/problem/${problem.id}">
                <h1>${problem.id} - ${problem.title}</h1>
            </a>
            <a href="https://www.acmicpc.net/submit/${problem.id}">
                <button class="submit vs-style">제출하기</button>
            </a>
            ${this.getProblemStatsTable(problem.problemStats)}
            <h2>문제</h2>
            ${problem.description}
            <h2>입력</h2>
            ${problem.inputDiscription}
            <h2>출력</h2>
            ${problem.outputDescription}
            <div class="input">
                <h2>테스트 케이스</h2>
                <button class="run-all-test-cases-btn icon-btn"><img src="${playIconUri}" alt="Copy" height="14"></button>
            </div>
            ${this.getTestCases(problem.inputs, problem.outputs)}
            <a href="https://www.acmicpc.net/submit/${problem.id}">
                <button class="submit vs-style">제출하기</button>
            </a>
            <script src="${scriptMainUri}"></script>
            </body>
        </html>
        `;
    }

    private getProblemStatsTable(problemStats: ProblemStats) {
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

    private getTestCases(inputs: string[], outputs: string[]) {
		const copyIconUri = this.getMediaFileUri('copy_icon.png');
        const playIconUri = this.getMediaFileUri('play_icon.png');

        let html = `<div>`;
        for (let i = 0; i < inputs.length; i++) {
            html = html + `<div class="example">
                        <div class="input">
                            <div class="input-head">
                                <h3>입력 ${i + 1}</h3>
                                <button class="input-copy-btn icon-btn" data-target=${i}><img src="${copyIconUri}" alt="Copy" height="14"></button>
                                <button class="run-test-case-btn icon-btn" data-target=${i}><img src="${playIconUri}" alt="Copy" height="14"></button>
                            </div>
                            <pre>${inputs[i]}</pre>
                        </div>
                        <div class="output">
                            <div class="input-head">
                                <h3>출력 ${i + 1}</h3>
                                <button class="output-copy-btn icon-btn" data-target=${i} title="복사"><img src="${copyIconUri}" alt="Copy" height="14"></button>
                            </div>
                            <pre>${outputs[i]}</pre>
                        </div>
                    </div>
                    `;
        }
        return html + '</div>';
    }

    private getMediaFileUri(fileName: string) {
        const webview = this._panel.webview;
        const filePath = vscode.Uri.joinPath(this._extensionUri, 'media', fileName);
		return webview.asWebviewUri(filePath);
    }
}
