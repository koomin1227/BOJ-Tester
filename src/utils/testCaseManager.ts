import { Problem } from "../types";

export function addTestCase(input: string, output: string, problem: Problem) {
    problem.inputs.push(input);
    problem.outputs.push(output);
}

export function deleteTestCase(testCaseIndex: number, problem: Problem) {
    if (testCaseIndex >= problem.DefaultTestCaseCount) {
        problem.inputs.splice(testCaseIndex, 1);
    }
}

export function editTestCase(input: string, output: string, testCaseIndex: number, problem: Problem) {
    if (testCaseIndex >= problem.DefaultTestCaseCount) {
        problem.inputs[testCaseIndex] = input;
        problem.outputs[testCaseIndex] = output;
    }
}