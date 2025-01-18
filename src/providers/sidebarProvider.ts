import * as vscode from 'vscode';

export class SidebarProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<void | vscode.TreeItem | null | undefined> =
        new vscode.EventEmitter<void | vscode.TreeItem | null | undefined>();
    readonly onDidChangeTreeData: vscode.Event<void | vscode.TreeItem | null | undefined> =
        this._onDidChangeTreeData.event;

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(): vscode.TreeItem[] {
        const button = new vscode.TreeItem('Open Problem Webview');
        button.command = {
            command: 'boj-tester.openProblemInfo',
            title: '백준 문제 열기',
        };
        return [button];
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}