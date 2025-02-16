import { execSync, spawn, SpawnOptionsWithoutStdio } from 'child_process';
import { getWorkSpaceRootFolder } from './fileGenerator';

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
        const workSpaceRootFolder = getWorkSpaceRootFolder();
        if (!workSpaceRootFolder) {
            throw new Error('Fail to load work space root folder');
        }

        return spawn(command, args, {
            ...options,
            env: this.env,
            cwd: workSpaceRootFolder
        });
    }
}

export const childProcess = new ChildProcess();