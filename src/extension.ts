import * as vscode from 'vscode';
import { openProblemInfo } from './commands/openProblemInfo';
import { SidebarProvider } from './providers/sidebarProvider';
import { createAndOpenProblemFile } from './commands/createProblemFile';
import { checkSettingsAndOpenIfMissing } from './utils/configuration';
import { toggleIdeFeature } from './commands/toggleIdeFeature';
import { FileTreeProvider } from './providers/FileTreeProvider';
import { openFileAndProblemInfo } from './commands/openFileAndProblemInfo';

export function activate(context: vscode.ExtensionContext) {
	checkSettingsAndOpenIfMissing(context);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'bojTester',
			new SidebarProvider(context.extensionUri)
		)
	);

	const treeProvider = new FileTreeProvider();
  	vscode.window.registerTreeDataProvider('bojTester.tree', treeProvider);
	
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
	vscode.commands.registerCommand('boj-tester.openFileAndProblemInfo', (fileUri: vscode.Uri) => {
		openFileAndProblemInfo(context, fileUri);
	})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('boj-tester.toggleIdeFeature', () => {
			toggleIdeFeature();
		})
	);
}

export function deactivate() { }
