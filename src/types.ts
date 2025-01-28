export interface ProblemStats {
    timeLimit: string;
    memoryLimit: string;
    submissions: number;
    correctSubmissions: number;
    solvers: number;
    correctRate: number;
}
export interface Problem {
    id: number;
    title: string;
    description: string;
    inputDiscription: string;
    outputDescription: string;
    DefaultTestCaseCount: number;
    inputs: string[];
    outputs: string[];
    problemStats: ProblemStats;
}