import { execSync, spawn, SpawnOptionsWithoutStdio } from 'child_process';
import * as vscode from 'vscode';

class ChildProcess {
    private env: NodeJS.ProcessEnv = process.env;

    constructor(){
        if(process.platform === 'darwin') {
            const zshShellPathEnv = execSync('zsh -i -c "printenv"', { encoding: 'utf-8'})
                .split('\n')
                .map((line) => line.split('='))
                .filter(([key]) => key === 'PATH').pop();

            if(zshShellPathEnv) {
                this.env['PATH'] += `:${zshShellPathEnv[1]}`;
            }
        }
    }

    spawn(command: string, args: string[] = [], options?: SpawnOptionsWithoutStdio){
        const workSpaceRootFolder = this.getWorkspaceRootFolder();
        if (!workSpaceRootFolder) {
            throw new Error('Fail to load work space root folder');
        }

        return spawn(command, args, {
            ...options,
            env: this.env,
            cwd: workSpaceRootFolder
        });
    }

    private getWorkspaceRootFolder() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            return workspaceFolders[0].uri.fsPath;
        } else {
            vscode.window.showErrorMessage('작업 영역이 없습니다. 폴더를 열고 문제를 생성해주세요. 혹은 설정창에서 기본 폴더를 설정해주세요.');
            return null;
        }
    }
}

export const childProcess = new ChildProcess();