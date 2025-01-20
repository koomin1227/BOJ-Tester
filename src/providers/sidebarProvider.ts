import * as vscode from "vscode";

export class SidebarProvider implements vscode.WebviewViewProvider {
    _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) { }


    revive(panel: vscode.WebviewView) {
        this._view = panel;
    }

    resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        webviewView.webview.options = { enableScripts: true };

        webviewView.webview.html = this._getHtmlForSidebar(webviewView.webview);
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
            default:
                break;
        }
    }


    private _getHtmlForSidebar(webview: vscode.Webview) {
        const stylesMainUri = this.getMediaFileUri('sidebar_style.css', webview);
        const scriptMainUri = this.getMediaFileUri('sidebar_script.js', webview);
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
        <button id="openProblemInfo">문제보기</button>
        <script src="${scriptMainUri}"></script>
      </body>
      </html>`;
    }
    private getMediaFileUri(fileName: string, webview: vscode.Webview) {
        const filePath = vscode.Uri.joinPath(this._extensionUri, 'media', fileName);
        return webview.asWebviewUri(filePath);
    }
}