import * as vscode from 'vscode';
import { childProcess } from './process';
import { Problem } from '../types';
import path from 'path';
import { execSync } from 'child_process';
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
        const extension = filePath.split('.').pop()?.toLowerCase();
        
        if (extension === 'cpp') {
            childProcess.spawn('rm', [filePath.replace(/\.cpp$/, '')]);
        } else if (extension === 'c') {
            childProcess.spawn('rm', [filePath.replace(/\.c$/, '')]);
        }

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
                resolve(
                    output
                        .split('\n')
                        .map(line => line.trimEnd())
                        .join('\n')
                        .trim()
                );
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
    const config = vscode.workspace.getConfiguration('BOJ-Tester');
    const useCustomCommand = config.get<boolean>('useCustomCommand', false);
    const customOptions = config.get<{ [key: string]: string }>('customCommandOption', {});

    switch (extension) {
        case 'py':
            const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
            const pythonOptions = useCustomCommand && customOptions.py ? customOptions.py.split(' ') : [];
            return childProcess.spawn(pythonCommand, [...pythonOptions, filePath]);

        case 'java':
            const dirName = path.dirname(filePath);
            const javaOptions = useCustomCommand && customOptions.java ? customOptions.java.split(' ') : [];
            return childProcess.spawn('java', [...javaOptions, '-cp', dirName, filePath]);

        case 'js':
            const jsOptions = useCustomCommand && customOptions.js ? customOptions.js.split(' ') : [];
            return childProcess.spawn('node', [...jsOptions, filePath]);

        case 'cpp':
            return compileAndRunCpp(filePath);

        case 'c':
            return compileAndRunC(filePath);

        case 'kt':
            const ktOptions = useCustomCommand && customOptions.kt ? customOptions.kt.split(' ') : [];
            return childProcess.spawn('kotlinc', [...ktOptions, filePath, '-include-runtime', '-d', 'Program.jar'])
                .on('close', () => childProcess.spawn('java', ['-jar', 'Program.jar']));

        case 'swift':
            const swiftOptions = useCustomCommand && customOptions.swift ? customOptions.swift.split(' ') : [];
            return childProcess.spawn('swift', [...swiftOptions, filePath]);

        case 'go':
            const goOptions = useCustomCommand && customOptions.go ? customOptions.go.split(' ') : [];
            return childProcess.spawn('go', ['run', ...goOptions, filePath]);

        default:
            throw new Error(`Unsupported file type: .${extension}`);
    }
}

function compileAndRunCpp(filePath: string) {
    return compileAndRun(filePath, 'g++');
}


function compileAndRunC(filePath: string) {
    return compileAndRun(filePath, 'gcc');
}

function compileAndRun(filePath: string, compiler: 'gcc' | 'g++') {
    const extension = filePath.split('.').pop()?.toLowerCase() as string;
    const outputFile = filePath.replace(/\.(c|cpp)$/, '');
    const config = vscode.workspace.getConfiguration('BOJ-Tester');
    const useCustomCommand = config.get<boolean>('useCustomCommand', false);
    const customOptions = config.get<{ [key: string]: string }>('customCommandOption', {});

    let compileCommand: string;
    if (useCustomCommand && extension && customOptions[extension]) {
        const options = customOptions[extension].split(' ');
        compileCommand = `${compiler} ${options.join(' ')} "${filePath}" -o "${outputFile}"`;
    } else {
        compileCommand = `${compiler} "${filePath}" -o "${outputFile}"`;
    }
    
    execSync(compileCommand);
    return childProcess.spawn(`${outputFile}`)
        .on('close', () => childProcess.spawn(process.platform === 'win32' ? 'del' : 'rm', [outputFile]));
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