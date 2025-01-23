import * as vscode from 'vscode';
import { openProblemInfo } from './commands/openProblemInfo';
import { SidebarProvider } from './providers/sidebarProvider';
import { createAndOpenProblemFile } from './commands/createProblemFile';
import { checkSettingsAndOpenIfMissing } from './utils/configuration';

export function activate(context: vscode.ExtensionContext) {
	checkSettingsAndOpenIfMissing(context);
	
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
			createAndOpenProblemFile(context);
		})
	);
}

export function deactivate() { }
