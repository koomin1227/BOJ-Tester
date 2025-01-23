import * as vscode from 'vscode';
import { openProblemInfo } from './commands/openProblemInfo';
import { SidebarProvider } from './providers/sidebarProvider';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'bojTester',
			new SidebarProvider(context.extensionUri)
		)
	);
	
	context.subscriptions.push(
		vscode.commands.registerCommand('boj-tester.openProblemInfo', () => {
			openProblemInfo(context);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('boj-tester.createProblem', () => {
		})
	);
}

export function deactivate() { }
