import * as vscode from 'vscode';
import { SidebarProvider } from './providers/sidebarProvider';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "boj-tester" is now active!');

	const disposable = vscode.commands.registerCommand('boj-tester.openProblemInfo', () => {
		vscode.window.showInformationMessage('Hello World from BOJ Tester!');
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(
		vscode.window.registerTreeDataProvider(
			'bojTesterSidebar',
			new SidebarProvider()
		)
	);
}

export function deactivate() { }
