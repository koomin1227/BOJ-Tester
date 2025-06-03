import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class FileTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<undefined> = new vscode.EventEmitter();
    readonly onDidChangeTreeData: vscode.Event<undefined> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            return [];
        }

        const dirPath = element?.resourceUri?.fsPath || workspaceFolders[0].uri.fsPath;
        return this.getDirectoryChildren(dirPath);
    }

    private async getDirectoryChildren(dirPath: string): Promise<vscode.TreeItem[]> {
        const items: vscode.TreeItem[] = [];

        const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.name.startsWith('.')) {
                continue;
            }
            const fullPath = path.join(dirPath, entry.name);
            const uri = vscode.Uri.file(fullPath);
            if (entry.isDirectory()) {
                const folderItem = new vscode.TreeItem(entry.name, vscode.TreeItemCollapsibleState.Collapsed);
                folderItem.resourceUri = uri;
                folderItem.contextValue = 'folder';
                items.push(folderItem);
            } else {
                const fileItem = new vscode.TreeItem(entry.name, vscode.TreeItemCollapsibleState.None);
                fileItem.resourceUri = uri;
                fileItem.command = {
                    command: 'boj-tester.openFileAndProblemInfo',
                    title: 'Open File',
                    arguments: [uri],
                };
                fileItem.contextValue = 'file';
                items.push(fileItem);
            }
        }

        return items.sort((a, b) => {
            const aIsFolder = a.collapsibleState !== vscode.TreeItemCollapsibleState.None;
            const bIsFolder = b.collapsibleState !== vscode.TreeItemCollapsibleState.None;
            if (aIsFolder && !bIsFolder) {return -1;}
            if (!aIsFolder && bIsFolder) {return 1;}
            return a.label!.toString().localeCompare(b.label!.toString());
        });
    }
}