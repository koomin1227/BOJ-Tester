import * as vscode from "vscode";
import { getFeatureStatus } from "../commands/toggleAutocomplete";

export class SidebarProvider implements vscode.WebviewViewProvider {
    _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) { }


    revive(panel: vscode.WebviewView) {
        this._view = panel;
    }

    async resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        webviewView.webview.options = { enableScripts: true };

        webviewView.webview.html = await this._getHtmlForSidebar(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(
            async (message) => {
                this.handleMessage(message);
            },
        );
    }

    private handleMessage(message: any) {
        switch (message.command) {
            case "openProblemInfo":
                vscode.commands.executeCommand("boj-tester.openProblemInfo");
                break;
            case "createProblem":
                vscode.commands.executeCommand("boj-tester.createProblem");
                break;
            case "toggleAutocomplete":
                vscode.commands.executeCommand("boj-tester.toggleAutocomplete");
                break;
            default:
                break;
        }
    }


    private async _getHtmlForSidebar(webview: vscode.Webview) {
        const stylesMainUri = this.getMediaFileUri('sidebar_style.css', webview);
        const scriptMainUri = this.getMediaFileUri('sidebar_script.js', webview);
        const buttonStatus = await this.getButtonStatus();
        return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel='stylesheet' href='${stylesMainUri}' />
        <title>Todo</title>
      </head>
      <body>
        문제 정보
        <button id="openProblemInfo">문제 보기</button>
        <div style="height: 10px;"></div>
        <button id="createProblem">문제 파일 생성</button>
        <div style="height: 20px;"></div>
        IDE 제어
        <button id="toggleAutocomplete">${buttonStatus}</button>

        <script src="${scriptMainUri}"></script>
      </body>
      </html>`;
    }

    private getMediaFileUri(fileName: string, webview: vscode.Webview) {
        const filePath = vscode.Uri.joinPath(this._extensionUri, 'media', fileName);
        return webview.asWebviewUri(filePath);
    }

    private async getButtonStatus() {
        const isFeatureEnabled = await getFeatureStatus();
        if (isFeatureEnabled) {
            return '자동 완성 끄기';
        } else {
            return '자동 완성 켜기';
        }
    }
}