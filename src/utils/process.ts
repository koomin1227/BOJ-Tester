import { execSync, spawn } from 'child_process';

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

    spawn(command: string, args: string[] = []){
        return spawn(command, args, {
            env: this.env
        });
    }
}

export const childProcess = new ChildProcess();