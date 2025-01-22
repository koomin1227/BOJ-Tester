import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import { Problem } from '../types';
import path from 'path';
const outputChannel = vscode.window.createOutputChannel('Test Results');

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
    outputChannel.clear(); 
    outputChannel.show();
    const result = await runTestCase(filePath, inputData, outputData);
    printResult(result, testCaseNumber + 1);
}

export async function runAndPrintAllTestCase(filePath: string, problem: Problem) {
    outputChannel.clear(); 
    outputChannel.show();
    const results = [];
    for (let i = 0; i < problem.inputs.length; i++) {
        const inputData = problem.inputs[i];
        const outputData = problem.outputs[i];
        const result = await runTestCase(filePath, inputData, outputData);
        results.push(result);
        printResult(result, i + 1);
    }

    const summary = summarizeTestResults(results);
    outputChannel.appendLine(summary);
}


function summarizeTestResults(testResults: TestCaseResult[]): string {
    const totalTests = testResults.length;
    const passedTests = testResults.filter(result => result.isSuccess).length;

    const failedCases = testResults
        .map((result, index) => (!result.isSuccess && !result.isError ? index + 1 : null))
        .filter(index => index !== null);

    const errorCases = testResults
        .map((result, index) => (result.isError ? index + 1 : null))
        .filter(index => index !== null);

    const failedTests = failedCases.length;
    const errorTests = errorCases.length;

    const successRate = ((passedTests / totalTests) * 100).toFixed(2);

    let summary = `────────────────────────────────────\n🔍 Test Summary\n`;
    summary += `────────────────────────────────────\n`;
    summary += `📋 Total Tests: ${totalTests}\n`;
    summary += `✅ Passed: ${passedTests}\n`;
    summary += `❌ Failed: ${failedTests} ${failedTests > 0 ? `(${failedCases.join(', ')})` : ''}\n`;
    summary += `❗ Errors: ${errorTests} ${errorTests > 0 ? `(${errorCases.join(', ')})` : ''}\n`;
    summary += `📊 Success Rate: ${successRate}%\n`;
    summary += `────────────────────────────────────\n`;

    return summary;
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
		const process = getProcessForRunning(filePath);

		let output = '';
		let error = '';

        const timeout = setTimeout(() => {
            process.kill();
            reject(new Error('Process timed out after 3 seconds'));
        }, 3000);

		process.stdout.on('data', (data) => {
			output += data.toString();
		});

		process.stderr.on('data', (data) => {
			error += data.toString();
		});

        process.on('close', (code) => {
            clearTimeout(timeout);
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

function getProcessForRunning(filePath: string) {
    const extension = filePath.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'py':
            return childProcess.spawn('python3', [filePath]);

        case 'java':
            const dirName = path.dirname(filePath);
		    return childProcess.spawn(`java`, ["-cp", dirName, filePath]);

        case 'js':
            return childProcess.spawn('node', [filePath]);

        case 'cpp':
            return compileAndRunCpp(filePath);

        case 'c':
            return compileAndRunC(filePath);

        case 'cs':
            return childProcess.spawn('dotnet', ['run', '--project', filePath]);

        case 'kt':
            return childProcess.spawn('kotlinc', [filePath, '-include-runtime', '-d', 'Program.jar'])
                .on('close', () => childProcess.spawn('java', ['-jar', 'Program.jar']));

        case 'swift':
            return childProcess.spawn('swift', [filePath]);

        case 'go':
            return childProcess.spawn('go', ['run', filePath]);

        default:
            throw new Error(`Unsupported file type: .${extension}`);
    }
}

function compileAndRunCpp(filePath: string) {
    const outputFile = filePath.replace(/\.cpp$/, '');
    return childProcess.spawn('g++', [filePath, '-o', outputFile])
        .on('close', (code) => {
            if (code === 0) {
                childProcess.spawn(outputFile);
            } else {
                throw new Error('C++ compilation failed.');
            }
        });
}

function compileAndRunC(filePath: string) {
    const outputFile = filePath.replace(/\.c$/, '');
    return childProcess.spawn('gcc', [filePath, '-o', outputFile])
        .on('close', (code) => {
            if (code === 0) {
                childProcess.spawn(outputFile);
            } else {
                throw new Error('C compilation failed.');
            }
        });
}

export function printResult(result: TestCaseResult, testCaseNumber: number) {
    outputChannel.appendLine('────────────────────────────────────');
    if (result.isError) {
        outputChannel.appendLine(`❗  Test Case ${testCaseNumber}: ERROR ❌`);
        outputChannel.appendLine('────────────────────────────────────');
        outputChannel.appendLine(`❗ Error Message:\n${result.errorMessage}`);
    } else {
        if (result.isSuccess) {
            outputChannel.appendLine(`🎉  Test Case ${testCaseNumber}: SUCCESS ✅`);
            outputChannel.appendLine('────────────────────────────────────');
            outputChannel.appendLine(`✅ Actual Output:\n${result.actualOutput}`);
        } else {
            outputChannel.appendLine(`🚫  Test Case ${testCaseNumber}: FAILED ❌`);
            outputChannel.appendLine('────────────────────────────────────');
            outputChannel.appendLine(`❌ Actual Output:\n${result.actualOutput}`);
        }
        outputChannel.appendLine(`🎯 Expected Output:\n${result.expectedOutput}`);
    }
    outputChannel.appendLine('────────────────────────────────────');
}