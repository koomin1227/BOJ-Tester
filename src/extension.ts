import * as vscode from 'vscode';
import { openProblemInfo } from './commands/openProblemInfo';
import { SidebarProvider } from './providers/sidebarProvider';
import { createAndOpenProblemFile } from './commands/createProblemFile';
import { checkSettingsAndOpenIfMissing } from './utils/configuration';
import { toggleIdeFeature } from './commands/toggleIdeFeature';

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
		vscode.commands.registerCommand('boj-tester.openSettings', () => {
			vscode.commands.executeCommand('workbench.action.openSettings', `@ext:koomin1227.boj-tester`);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('boj-tester.createProblem', () => {
			createAndOpenProblemFile(context);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('boj-tester.toggleIdeFeature', () => {
			toggleIdeFeature();
		})
	);
}

export function deactivate() { }
