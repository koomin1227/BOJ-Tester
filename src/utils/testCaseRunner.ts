import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import { Problem } from '../types';

interface TestCaseResult {
    isSuccess: boolean;
    isError: boolean;
    actualOutput: string | null;
    expectedOutput: string | null;
    errorMessage: string | null;
}
export async function runAndPrintTestCase(filePath: string, problem: Problem, testCaseNumber: number) {
    const inputData = problem.inputs[testCaseNumber];
    const outputData = problem.outputs[testCaseNumber];
    const result = await runTestCase(filePath, inputData, outputData);
    printResult(result, testCaseNumber + 1);
}

export async function runTestCase(filePath: string, inputData: string, outputData: string): Promise<TestCaseResult> {
    try {
        const output = await runCode(filePath, inputData);
        const testCaseResult: TestCaseResult = {
            isSuccess: false,
            isError: false,
            actualOutput: output,
            expectedOutput: outputData,
            errorMessage: null
        };
        if (output === outputData) {
            testCaseResult.isSuccess = true;
        }
        return testCaseResult;
    } catch (error: any) {
        return {
            isSuccess: false,
            isError: true,
            actualOutput: null,
            expectedOutput: outputData,
            errorMessage: error.message
        };
    }
}

async function runCode(filePath: string, inputData: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const process = childProcess.spawn('python3', [filePath]);

		let output = '';
		let error = '';

		process.stdout.on('data', (data) => {
			output += data.toString();
		});

		process.stderr.on('data', (data) => {
			error += data.toString();
		});

		process.on('close', (code) => {
			if (code === 0) {
				resolve(output.trim());
			} else {
				reject(new Error(error || `Process exited with code ${code}`));
			}
		});

		process.stdin.write(inputData);
		process.stdin.end();
	});
}

export function printResult(result: TestCaseResult, testCaseNumber: number) {
    const outputChannel = vscode.window.createOutputChannel('Test Results');
    outputChannel.appendLine('────────────────────────────────────');
    if (result.isError) {
        outputChannel.appendLine(`⚠️  Test Case ${testCaseNumber}: ERROR ❌`);
        outputChannel.appendLine('────────────────────────────────────');
        outputChannel.appendLine(`  ❗ Error Message:\n    ${result.errorMessage}`);
    } else {
        if (result.isSuccess) {
            outputChannel.appendLine(`🎉  Test Case ${testCaseNumber}: SUCCESS ✅`);
            outputChannel.appendLine('────────────────────────────────────');
            outputChannel.appendLine(`  ✅ Actual Output:\n    ${result.actualOutput}`);
        } else {
            outputChannel.appendLine(`🚫  Test Case ${testCaseNumber}: FAILED ❌`);
            outputChannel.appendLine('────────────────────────────────────');
            outputChannel.appendLine(`  ❌ Actual Output:\n    ${result.actualOutput}`);
        }
        outputChannel.appendLine(`  🎯 Expected Output:\n    ${result.expectedOutput}`);
    }
    outputChannel.appendLine('────────────────────────────────────');
    outputChannel.show();
}