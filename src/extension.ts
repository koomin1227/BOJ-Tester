import * as vscode from 'vscode';
import { SidebarProvider } from './providers/sidebarProvider';
import { openProblemInfo } from './commands/openProblemInfo';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('boj-tester.openProblemInfo', () => {
			openProblemInfo(context);
		})
	);

	context.subscriptions.push(
		vscode.window.registerTreeDataProvider(
			'bojTesterSidebar',
			new SidebarProvider()
		)
	);
}

export function deactivate() { }
