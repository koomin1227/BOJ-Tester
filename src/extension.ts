import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "boj-tester" is now active!');

	const disposable = vscode.commands.registerCommand('boj-tester.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from BOJ Tester!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
